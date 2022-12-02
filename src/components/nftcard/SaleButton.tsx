import {
  Box,
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
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { web3Inject } from "../../contracts";
import erc721Contract from "../../contracts/erc721.contract";
import { Images } from "../../images";
import nftService from "../../services/nft.service";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { SalePeriod, SaleType } from "../../services/types/enum";
import { selectProfile } from "../../store/profileSlice";
import { convertToContractValue } from "../../utils/utils";
import TokenSymbolToken from "../filters/TokenSymbolButton";
import PrimaryButton from "../PrimaryButton";

export default function SaleButton({
  nft,
  children,
  ...rest
}: ButtonProps & { nft: NftDto }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [isFirst, setIsFirst] = useState(true);
  const [paymentToken, setPaymentToken] = useState<PaymentToken>();
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
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
      await erc721Contract.approveForAll(
        nft.nftContract,
        user,
        nft.chain.mpContract
      );
      const priceContractValue = Number(
        convertToContractValue({
          amount: Number(price),
          decimal: paymentToken.decimals,
        })
      );
      const period = SalePeriod.Month;
      const {
        data: { hashMessage },
      } = await nftService.getNftHashMessage(nft.id, {
        id: nft.id,
        option: SaleType.Sale,
        ownerAccept: true,
        paymentTokenId: paymentToken.id,
        period,
        price: priceContractValue,
      });
      const sign = await web3Inject.eth.personal.sign(hashMessage, user, "");
      const sale = await nftService.createSale(nft.id, {
        paymentTokenId: paymentToken.id,
        period: SalePeriod.Month,
        price: priceContractValue,
        signedSignature: sign,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <PrimaryButton onClick={onOpen} {...rest}>
        {children}
      </PrimaryButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <VStack pt={5} px={5} w="full">
              <Heading fontSize="2xl">PUT ON SALE</Heading>
              <HStack spacing={0}>
                <Text>You are about sell your&nbsp;</Text>
                <Text color="gray">
                  {nft.name} {nft.tokenId ? `#${nft.tokenId}` : ""}
                </Text>
              </HStack>
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
                          mr={2}
                          size="sm"
                          onChangeToken={(p) => {
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
              <VStack spacing={2} py={5} w="full" fontWeight="semibold">
                <HStack w="full" justifyContent="space-between">
                  <Text>Marketplace fee:</Text>
                  <Text>--</Text>
                </HStack>
                <HStack w="full" justifyContent="space-between">
                  <Text>Your will receive:</Text>
                  <Text>--</Text>
                </HStack>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter w="full">
            <HStack w="full" justifyContent="center" px={5}>
              <PrimaryButton isLoading={loading} onClick={createSale} w="full">
                Confirm
              </PrimaryButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
