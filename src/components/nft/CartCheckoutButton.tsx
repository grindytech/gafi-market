import {
  Button,
  ButtonProps,
  Divider,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import erc20Contract from "../../contracts/erc20.contract";
import mpContract from "../../contracts/marketplace.contract";
import {
  useGetChainInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import useSwal from "../../hooks/useSwal";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { reset } from "../../store/bagSlice";
import { selectProfile } from "../../store/profileSlice";
import { convertToContractValue, numeralFormat } from "../../utils/utils";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButton from "../SwitchNetworkButton";
import { NftItem } from "./Cart";

export default function CartCheckoutButton({
  nfts,
  total,
  children,
  refetch,
  onError,
  onSuccess,
  ...rest
}: {
  nfts: NftDto[];
  total: number;
  refetch: () => Promise<any>;
  onError: () => void;
  onSuccess: () => void;
} & ButtonProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { user } = useSelector(selectProfile);
  const { swAlert } = useSwal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { chainInfo } = useGetChainInfo({
    chainId: nfts.length > 0 ? nfts[0].chain : undefined,
  });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: nfts.length > 0 ? nfts[0].sale?.paymentToken : undefined,
  });
  const checkout = async () => {
    try {
      setIsLoading(true);
      const approvePrice = convertToContractValue({
        amount: total,
        decimal: paymentInfo?.decimals,
      });
      const allowance = await erc20Contract.getAllowance(
        paymentInfo?.contractAddress,
        chainInfo?.mpContract,
        user
      );
      if (Number(allowance) < Number(approvePrice)) {
        await erc20Contract.approve(
          paymentInfo?.contractAddress,
          chainInfo?.mpContract,
          user,
          approvePrice
        );
      }
      await mpContract.matchBag(nfts, user, chainInfo?.mpContract, paymentInfo);
      onClose();
      onSuccess();
      swAlert({
        title: "COMPLETE",
        text: `Checkout successfully!`,
        icon: "success",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Inventory",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) router.push("/profile");
      });
      dispatch(reset());
    } catch (error) {
      console.error(error);
      onClose();
      onError();
      swAlert({
        title: "Failed",
        text:
          error.message && error.message.length < 200
            ? error.message
            : "Checkout failed!",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PrimaryButton
        onClick={async (e) => {
          e.preventDefault();
          await refetch();
          onOpen();
        }}
        {...rest}
      >
        {children}
      </PrimaryButton>
      <Modal isOpen={isOpen && nfts.length > 0} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>CHECKOUT</ModalHeader>
          <ModalBody overflow="auto">
            <VStack pt={5} w="full">
              <VStack w="full">
                {nfts.map((item, index) => (
                  <>
                    {index !== 0 && <Divider />}
                    <NftItem item={item} />
                  </>
                ))}
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter w="full">
            <VStack w="full">
              <HStack
                rounded="lg"
                bg="rgba(0,0,0,0.15)"
                w="full"
                p={3}
                justifyContent="space-between"
                alignContent="center"
              >
                <Text fontSize="lg" fontWeight="semibold">
                  Total
                </Text>
                <Text>
                  {numeralFormat(total)} {paymentInfo?.symbol}
                </Text>
              </HStack>
              <HStack w="full" justifyContent="center">
                <Button w="full" onClick={onClose}>
                  Close
                </Button>
                <SwitchNetworkButton
                  symbol={chainInfo?.symbol}
                  name={chainInfo?.name}
                  w="full"
                >
                  <PrimaryButton
                    onClick={checkout}
                    isLoading={isLoading}
                    w="full"
                  >
                    Confirm
                  </PrimaryButton>
                </SwitchNetworkButton>
              </HStack>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
