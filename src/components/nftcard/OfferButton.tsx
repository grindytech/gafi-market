import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Image,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { web3Inject } from "../../contracts";
import erc20Contract from "../../contracts/erc20.contract";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import { Images } from "../../images";
import nftService from "../../services/nft.service";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { SalePeriod, SaleType } from "../../services/types/enum";
import { selectProfile } from "../../store/profileSlice";
import { selectSystem } from "../../store/systemSlice";
import { convertToContractValue, getUrl, numeralFormat } from "../../utils/utils";
import TokenSymbolToken from "../filters/TokenSymbolButton";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButton from "../SwitchNetworkButton";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import useSwal from "../../hooks/useSwal";
import useYupValidationResolver from "../../hooks/useYupValidationResolver";
import {
  useGetChainInfo,
  useGetCollectionInfo,
} from "../../hooks/useGetSystemInfo";

export default function OfferButton({
  nft,
  children,
  onSuccess,
  ...rest
}: BoxProps & { nft: NftDto; onSuccess?: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isFirst, setIsFirst] = useState(true);
  const [paymentToken, setPaymentToken] = useState<PaymentToken>();
  const { chains } = useSelector(selectSystem);
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(SalePeriod.Week);
  const { swAlert } = useSwal();
  const { chainInfo: chain } = useGetChainInfo({
    chainId: nft?.chain,
  });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: nft?.nftCollection,
  });
  const validationSchema = yup.object({
    price: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required("Required")
      .moreThan(0)
      .max(999999999)
      .test("isValidBalance", "Insufficient balance", async (value) => {
        const balance =
          chain && user
            ? await erc20Contract.getErc20Balance(
                user,
                paymentToken.contractAddress,
                chain?.symbol.toUpperCase(),
                paymentToken.decimals
              )
            : 0;
        if (balance < Number(value)) {
          return false;
        }
        return true;
      }),
  });
  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({ resolver });

  const createSale = async ({ price }) => {
    try {
      setLoading(true);
      const priceContractValue = convertToContractValue({
        amount: Number(price),
        decimal: paymentToken.decimals,
      });
      const allowance = await erc20Contract.getAllowance(
        paymentToken.contractAddress,
        chain?.mpContract,
        user,
        chain.symbol
      );
      if (Number(allowance) < Number(priceContractValue)) {
        await erc20Contract.approve(
          paymentToken.contractAddress,
          chain?.mpContract,
          user,
          priceContractValue
        );
      }
      const {
        data: { hashMessage },
      } = await nftService.getNftHashMessage(nft.id, {
        id: nft.id,
        option: SaleType.MakeOffer,
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
      //   nft.chain?.mpContract
      // );
      const sign = await web3Inject.eth.personal.sign(hashMessage, user, "");
      const sale = await nftService.createOffer(nft.id, {
        paymentTokenId: paymentToken.id,
        period,
        signedSignature: sign,
        offerPrice: Number(price),
      });
      onClose();
      onSuccess && onSuccess();
      swAlert({ title: "Offer successfully.", icon: "success" });
    } catch (error) {
      onClose();
      console.error(error);
      swAlert({
        title: "Failed",
        text:
          error.message && error.message.length < 200
            ? error.message
            : "Transaction failed!",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: !!paymentToken,
    paymentSymbol: paymentToken?.symbol,
  });
  const price = watch("price");
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
            <VStack spacing={3} pt={5} px={5} w="full">
              <Heading fontSize="2xl">MAKE OFFER</Heading>
              <VStack spacing={0}>
                <Text>You are about make offer for&nbsp;</Text>
                <Text color="gray">
                  {nft.name} {nft.tokenId ? `#${nft.tokenId}` : ""}
                </Text>
              </VStack>
              <Box py={3}>
                <Image
                  w="300px"
                  src={getUrl(nft.image)}
                  fallbackSrc={Images.Placeholder.src}
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
                          chain={chain?.id}
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
                {!errors.price ? (
                  priceAsUsd &&
                  price && (
                    <FormHelperText>
                      <Text
                        w="full"
                        textAlign="right"
                        fontSize="xs"
                        color="gray.500"
                      >
                        ~{prefix}
                        {numeralFormat(Number(price) * priceAsUsd)}
                      </Text>
                    </FormHelperText>
                  )
                ) : (
                  <FormErrorMessage>
                    {errors.price?.message?.toString()}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Duration</FormLabel>
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
              ></VStack>
            </VStack>
          </ModalBody>
          <ModalFooter w="full">
            <HStack w="full" justifyContent="center" px={5}>
              <SwitchNetworkButton
                symbol={chain?.symbol}
                name={chain?.name}
                w="full"
              >
                <PrimaryButton
                  isLoading={loading}
                  onClick={handleSubmit(createSale)}
                  w="full"
                >
                  Confirm
                </PrimaryButton>
              </SwitchNetworkButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
