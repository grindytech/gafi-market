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

  const checkout = async () => {
    try {
      setIsLoading(true);
      const approvePrice = convertToContractValue({
        amount: total,
        decimal: nfts[0].sale.paymentToken.decimals,
      });
      const allowance = await erc20Contract.getAllowance(
        nfts[0].sale.paymentToken.contractAddress,
        nfts[0].chain.mpContract,
        user
      );
      if (Number(allowance) < Number(approvePrice)) {
        await erc20Contract.approve(
          nfts[0].sale.paymentToken.contractAddress,
          nfts[0].chain.mpContract,
          user,
          approvePrice
        );
      }
      await mpContract.matchBag(nfts, user, nfts[0].chain.mpContract);
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
                    <NftItem item={item} onClose={onClose} />
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
                  {numeralFormat(total)} {nfts[0].sale.paymentToken.symbol}
                </Text>
              </HStack>
              <HStack w="full" justifyContent="center">
                <Button w="full" onClick={onClose}>
                  Close
                </Button>
                <SwitchNetworkButton
                  symbol={nfts[0].chain.symbol}
                  name={nfts[0].chain.name}
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
