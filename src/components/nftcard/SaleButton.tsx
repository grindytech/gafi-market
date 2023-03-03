import {
  Box,
  BoxProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { web3Inject } from "../../contracts";
import erc721Contract from "../../contracts/erc721.contract";
import {
  useGetChainInfo,
  useGetCollectionInfo,
} from "../../hooks/useGetSystemInfo";
import useSwal from "../../hooks/useSwal";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import useYupValidationResolver from "../../hooks/useYupValidationResolver";
import nftService from "../../services/nft.service";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { SalePeriod, SaleType } from "../../services/types/enum";
import { selectProfile } from "../../store/profileSlice";
import { getNftImageLink, numeralFormat } from "../../utils/utils";
import TokenSymbolToken from "../filters/TokenSymbolButton";
import { ImageWithFallback } from "../LazyImage";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButton from "../SwitchNetworkButton";

const validationSchema = yup.object({
  price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Required")
    .moreThan(0)
    .max(999999999),
});

export default function SaleButton({
  nft,
  children,
  onSuccess,
  ...rest
}: BoxProps & { nft: NftDto; onSuccess?: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Box
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
        {...rest}
      >
        {children}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <SalePopup nft={nft} onClose={onClose} onSuccess={onSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
const SalePopup = ({ nft, onClose, onSuccess }) => {
  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({ resolver });
  const { chainInfo } = useGetChainInfo({
    chainId: nft?.chain,
  });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: nft?.nftCollection,
  });
  const [paymentToken, setPaymentToken] = useState<PaymentToken>();
  const [marketFee, setMarketFee] = useState(0.05);
  const [collectionOwnerFee, setCollectionOwnerFee] = useState(0.0);
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(SalePeriod.Week);
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: !!paymentToken,
    paymentSymbol: paymentToken?.symbol,
  });
  const { swAlert } = useSwal();
  const createSale = async ({ price }) => {
    try {
      setLoading(true);
      await erc721Contract.approveForAll(
        nft.nftContract,
        user,
        chainInfo?.mpContract
      );
      // const priceContractValue = convertToContractValue({
      //   amount: Number(price),
      //   decimal: paymentToken.decimals,
      // });
      const {
        data: { hashMessage },
      } = await nftService.getNftHashMessage(nft.id, {
        id: nft.id,
        option: SaleType.Sale,
        ownerAccept: true,
        paymentTokenId: paymentToken.id,
        period,
        price: Number(price),
      });
      // const hashMessage = await mpContract.getMessageHash(
      //   {
      //     nftAddress: nft.nftContract,
      //     option: SaleType.Sale,
      //     paymentTokenContract: paymentToken.contractAddress,
      //     period: period,
      //     price: priceContractValue,
      //     saltNonce: nft.saltNonce,
      //     tokenId: nft.tokenId,
      //   },
      //   nft.chain.mpContract
      // );
      const sign = await web3Inject.eth.personal.sign(hashMessage, user, "");
      const sale = await nftService.createSale(nft.id, {
        paymentTokenId: paymentToken.id,
        period,
        price: Number(price),
        signedSignature: sign,
      });
      // toast.success("Listing successfully.");
      onClose();
      onSuccess && onSuccess();
      swAlert({ title: "Listing successfully", icon: "success" });
    } catch (error) {
      console.error(error);
      swAlert({
        title: "Failed",
        text:
          error.message && error.message.length < 200
            ? error.message
            : "Transaction failed!",
        icon: "error",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };
  const price = watch("price");
  const receive = () =>
    Number(price) - Number(price) * (marketFee + collectionOwnerFee);
  return (
    <VStack spacing={3} pt={5} px={5} w="full">
      <Heading fontSize="2xl">PUT ON SALE</Heading>
      <VStack spacing={0}>
        <Text>You are about sell your&nbsp;</Text>
        <Text color="gray">
          {nft.name} {nft.tokenId ? `#${nft.tokenId}` : ""}
        </Text>
      </VStack>
      <Box py={3}>
        <ImageWithFallback
          w="300px"
          src={
            nft.image ? getNftImageLink(nft.id, 600) : collectionInfo?.avatar
          }
        />
      </Box>
      <FormControl isInvalid={!!errors.price}>
        <FormLabel>Price</FormLabel>
        <InputGroup size="lg">
          <InputRightElement
            w="fit-content"
            children={
              <Box w="full">
                <TokenSymbolToken
                  disabled={loading}
                  chain={chainInfo?.id}
                  mr={2}
                  size="sm"
                  onChangeToken={(p) => {
                    setPaymentToken(p);
                  }}
                  idList={collectionInfo?.paymentTokens.map((c) =>
                    typeof c === "string" ? c : c.id
                  )}
                />
              </Box>
            }
          />
          <Input
            disabled={loading}
            {...register("price")}
            type="number"
            variant="filled"
            placeholder={"0.0"}
            _focusVisible={{
              borderColor: "primary.300",
              borderWidth: "1px",
            }}
          />
        </InputGroup>
        <FormErrorMessage>{errors.price?.message?.toString()}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Sale period</FormLabel>
        <InputGroup size="lg">
          <Select
            disabled={loading}
            variant="filled"
            defaultValue={SalePeriod.Week}
            _focusVisible={{
              borderColor: "primary.300",
              borderWidth: "1px",
            }}
            onChange={(e) => {
              setPeriod(Number(e.target.value));
            }}
          >
            <option value={SalePeriod.Week}>7 days</option>
            <option value={SalePeriod.TwoWeek}>14 days</option>
            <option value={SalePeriod.Month}>1 month</option>
          </Select>
        </InputGroup>
      </FormControl>
      <VStack
        color="gray"
        spacing={2}
        py={1}
        w="full"
        fontWeight="semibold"
        fontSize="sm"
      >
        <HStack w="full" justifyContent="space-between">
          <Text>Marketplace fee:</Text>
          <Text>{marketFee * 100} %</Text>
        </HStack>
        {/* <HStack w="full" justifyContent="space-between">
                  <Text>Collection owner fee:</Text>
                  <Text>{collectionOwnerFee * 100} %</Text>
                </HStack> */}
        <HStack alignItems="start" w="full" justifyContent="space-between">
          <Text>You will receive:</Text>
          <VStack spacing={0} alignItems="end">
            <Text color="gray">
              {receive() || "--"}
              &nbsp;
              {paymentToken?.symbol}
            </Text>
            {priceAsUsd && price && (
              <Text fontSize="xs" color="gray.500">
                ~{prefix}
                {numeralFormat(receive() * priceAsUsd)}
              </Text>
            )}
          </VStack>
        </HStack>
      </VStack>
      <HStack w="full" justifyContent="center">
        <SwitchNetworkButton symbol={chainInfo?.symbol} name={chainInfo?.name}>
          <PrimaryButton
            isLoading={loading}
            onClick={handleSubmit(createSale)}
            w="full"
          >
            Confirm
          </PrimaryButton>
        </SwitchNetworkButton>
      </HStack>
    </VStack>
  );
};
