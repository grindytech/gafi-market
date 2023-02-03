import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { SalePeriod } from "../../services/types/enum";
import TokenSymbolToken from "../filters/TokenSymbolButton";
import * as yup from "yup";
import useYupValidationResolver from "../../hooks/useYupValidationResolver";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profileSlice";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButton from "../SwitchNetworkButton";
import { ChainDto } from "../../services/types/dtos/ChainDto";
import { NftItem } from "../nft/Cart";
import erc721Contract from "../../contracts/erc721.contract";
import {
  convertToContractValue,
  generateId,
  numeralFormat,
} from "../../utils/utils";
import { GetBundleHashMessageDto } from "../../services/types/params/GetBundleHashMessage.dto";
import nftService from "../../services/nft.service";
import { web3Inject } from "../../contracts";
import { CreateBundleDto } from "../../services/types/params/CreateBundle.dto";
import useSwal from "../../hooks/useSwal";
import { useRouter } from "next/router";

type Props = {
  items: NftDto[];
  nftCollection: NftCollectionDto;
  chain: ChainDto;
  onClose: () => void;
  onSuccess: () => void;
};

const validationSchema = yup.object({
  price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Required")
    .moreThan(0)
    .max(999999999),
  name: yup.string().required("Bundle name is required!").max(200),
  description: yup.string().max(400),
});
export default function CreateBundleConfirm({
  items,
  nftCollection,
  chain,
  onClose,
  onSuccess,
}: Props) {
  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({ resolver });
  const [loading, setLoading] = useState(false);
  const [paymentToken, setPaymentToken] = useState<PaymentToken>();
  const [marketFee, setMarketFee] = useState(0.05);
  const [collectionOwnerFee, setCollectionOwnerFee] = useState(0.0);
  // const [period, setPeriod] = useState(SalePeriod.Week);
  const { user } = useSelector(selectProfile);
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: !!paymentToken,
    paymentSymbol: paymentToken?.symbol,
  });
  const { swAlert } = useSwal();
  const router = useRouter();
  const price = watch("price");
  const receive = () =>
    Number(price) - Number(price) * (marketFee + collectionOwnerFee);

  const createBundle = async ({ price, name, description }) => {
    try {
      setLoading(true);
      await erc721Contract.approveForAll(
        nftCollection.nftContract,
        user,
        chain.bundleContract
      );
      const priceContractValue = convertToContractValue({
        amount: Number(price),
        decimal: paymentToken.decimals,
      });
      const bundleId = generateId();
      const nftContract = nftCollection.nftContract;
      const idList = items.map((hero) => hero.id);
      const hashMessageParam: GetBundleHashMessageDto = {
        bundleId,
        ownerAccept: true,
        price: Number(price),
        paymentTokenId: paymentToken.id,
        idList,
      };
      const hashMessageRsp = await nftService.getBundleHashMessage(
        hashMessageParam
      );
      const signedSignature = await web3Inject.eth.personal.sign(
        hashMessageRsp.data.hashMessage,
        user,
        ""
      );
      const createBundleParam: CreateBundleDto = {
        bundleId,
        signedSignature,
        idList,
        paymentTokenId: paymentToken.id,
        price,
        saltNonce: hashMessageRsp.data.saltNonce,
        name,
        description,
      };
      const { data: id } = await nftService.createBundle(createBundleParam);
      onClose();
      onSuccess();
      swAlert({
        title: "COMPLETE",
        text: `Create bundle successfully!`,
        icon: "success",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Detail",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) router.push(`/bundle/${id}`);
      });
    } catch (error) {
      console.log(error);
      swAlert({
        title: "Failed",
        text:
          error.message && error.message.length < 200
            ? error.message
            : "Failed!",
        icon: "error",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };
  return (
    <VStack>
      <FormControl isInvalid={!!errors.price}>
        <FormLabel>Price</FormLabel>
        <InputGroup size="lg">
          <InputRightElement
            w="fit-content"
            children={
              <Box w="full">
                <TokenSymbolToken
                  disabled={loading}
                  chain={chain.id}
                  mr={2}
                  size="sm"
                  onChangeToken={(p) => {
                    setPaymentToken(p);
                  }}
                  idList={nftCollection?.paymentTokens as string[]}
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
      {/* <FormControl>
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
              console.log(e.target.value);
              setPeriod(Number(e.target.value));
            }}
          >
            <option value={SalePeriod.Week}>7 days</option>
            <option value={SalePeriod.TwoWeek}>14 days</option>
            <option value={SalePeriod.Month}>1 month</option>
          </Select>
        </InputGroup>
      </FormControl> */}
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Bundle name</FormLabel>
        <Input
          disabled={loading}
          {...register("name")}
          type="text"
          variant="filled"
          placeholder={"Bundle name"}
          _focusVisible={{
            borderColor: "primary.300",
            borderWidth: "1px",
          }}
        />
        <FormErrorMessage>{errors.name?.message?.toString()}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.description}>
        <FormLabel>Description</FormLabel>
        <Textarea
          disabled={loading}
          _focusVisible={{
            borderColor: "primary.200",
            boxShadow: "primary.200",
          }}
          _hover={{
            borderColor: "primary.200",
            boxShadow: "primary.200",
          }}
          {...register("description")}
          placeholder="Description"
        />
        {errors.description && (
          <FormErrorMessage>
            {errors.description.message.toString()}
          </FormErrorMessage>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>{items.length} items</FormLabel>
        <VStack w="full" maxH={"300px"} overflow="auto">
          {items.map((item, index) => (
            <>
              {index !== 0 && <Divider />}
              <NftItem item={item} />
            </>
          ))}
        </VStack>
      </FormControl>
      <FormControl>
        <FormLabel>Summary</FormLabel>
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
          <HStack w="full" justifyContent="space-between">
            <Text>Collection owner fee:</Text>
            <Text>{collectionOwnerFee * 100} %</Text>
          </HStack>
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
      </FormControl>
      <Box w="full" py={3}>
        <SwitchNetworkButton w="full" symbol={chain.symbol} name={chain.name}>
          <PrimaryButton
            isLoading={loading}
            onClick={handleSubmit(createBundle)}
            w="full"
          >
            Confirm
          </PrimaryButton>
        </SwitchNetworkButton>
      </Box>
    </VStack>
  );
}
