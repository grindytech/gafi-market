import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useSwitchNetwork from "../../connectWallet/useSwitchNetwork";
import { web3Inject } from "../../contracts";
import erc20Contract from "../../contracts/erc20.contract";
import useCustomToast from "../../hooks/useCustomToast";
import { Images } from "../../images";
import nftService from "../../services/nft.service";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { SalePeriod, SaleType } from "../../services/types/enum";
import { selectProfile } from "../../store/profileSlice";
import { convertToContractValue } from "../../utils/utils";
import TokenSymbolToken from "../filters/TokenSymbolButton";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButton from "../SwitchNetworkButton";

export default function OfferButton({
  nft,
  children,
  onSuccess,
  ...rest
}: ButtonProps & { nft: NftDto; onSuccess?: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [isFirst, setIsFirst] = useState(true);
  const [paymentToken, setPaymentToken] = useState<PaymentToken>();
  const [marketFee, setMarketFee] = useState(0.05);
  const [collectionOwnerFee, setCollectionOwnerFee] = useState(0.0);
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  const [period, setPeriod] = useState(SalePeriod.Week);
  const { isWrongNetwork, changeNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
      return;
    }
    if (!price) {
      setErrorMsg("Price is required");
      return;
    }
    if (Number(price) <= 0) {
      setErrorMsg("Please input a valid number");
      return;
    }
    setErrorMsg(undefined);
  }, [price]);
  const createSale = async () => {
    try {
      setLoading(true);
      const priceContractValue = convertToContractValue({
        amount: Number(price),
        decimal: paymentToken.decimals,
      });
      const allowance = await erc20Contract.getAllowance(
        paymentToken.contractAddress,
        nft.chain.mpContract,
        user
      );
      if (Number(allowance) < Number(priceContractValue)) {
        await erc20Contract.approve(
          paymentToken.contractAddress,
          nft.chain.mpContract,
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
      //   nft.chain.mpContract
      // );
      const sign = await web3Inject.eth.personal.sign(hashMessage, user, "");
      const sale = await nftService.createOffer(nft.id, {
        paymentTokenId: paymentToken.id,
        period,
        signedSignature: sign,
        offerPrice: Number(price),
      });
      toast.success("Offer successfully.");
      onClose();
      onSuccess && onSuccess();
    } catch (error) {
      console.error(error);
      error?.message && toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button onClick={(e) => { 
        e.preventDefault();
        onOpen();
      }} {...rest}>
        {children}
      </Button>
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
                  src={nft.image}
                  fallbackSrc={Images.Placeholder.src}
                />
              </Box>
              <FormControl isInvalid={!!errorMsg}>
                <FormLabel>Price</FormLabel>
                <InputGroup size="lg">
                  <InputRightElement
                    w="fit-content"
                    children={
                      <Box w="full">
                        <TokenSymbolToken
                          chain={nft.chain.id}
                          mr={2}
                          size="sm"
                          onChangeToken={(p) => {
                            debugger;
                            setPaymentToken(p);
                          }}
                        />
                      </Box>
                    }
                  />
                  <Input
                    type="number"
                    variant="filled"
                    placeholder={"0.0"}
                    _focusVisible={{
                      borderColor: "primary.300",
                      borderWidth: "1px",
                    }}
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  />
                </InputGroup>
                {!errorMsg ? (
                  // <FormHelperText>
                  //   Enter the email you'd like to receive the newsletter on.
                  // </FormHelperText>
                  <></>
                ) : (
                  <FormErrorMessage>{errorMsg}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Duration</FormLabel>
                <InputGroup size="lg">
                  <Select
                    variant="filled"
                    defaultValue={SalePeriod.Week}
                    _focusVisible={{
                      borderColor: "primary.300",
                      borderWidth: "1px",
                    }}
                    onChange={(e) => {
                      console.log(e.target.value);
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
                symbol={nft.chain.symbol}
                name={nft.chain.name}
                w="full"
              >
                <PrimaryButton
                  isLoading={loading}
                  onClick={createSale}
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
