import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { get } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useSwal from "../../hooks/useSwal";
import useYupValidationResolver from "../../hooks/useYupValidationResolver";
import nftService from "../../services/nft.service";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { Status } from "../../services/types/enum";
import { AddCollectionDto } from "../../services/types/params/AddCollection";
import { selectSystem } from "../../store/systemSlice";
import { checkIfFilesAreTooBig } from "../../utils/utils";
import ChooseFileImage from "../ChooseFileImage";
import ChoosePaymentToken from "../paymentToken/ChoosePaymentoken";
import PrimaryButton from "../PrimaryButton";

const validationSchema = yup.object({
  cover: yup
    .mixed()
    .nullable()
    .test("cover-size", "Max size is 5mb", (files) =>
      checkIfFilesAreTooBig(files, 5)
    ),
  avatar: yup
    .mixed()
    .nullable()
    .test("avatar-size", "Max size is 5mb", (files) =>
      checkIfFilesAreTooBig(files, 5)
    ),
  featuredImage: yup
    .mixed()
    .nullable()
    .test("featured-size", "Max size is 5mb", (files) =>
      checkIfFilesAreTooBig(files, 5)
    ),
  name: yup.string().required("Name is required").max(200),
  description: yup.string().required("Description is required").max(1000),
  owner: yup.string().required("Owner address is required"),
  alias: yup.string().required("Short url is required").max(200),
  nftContract: yup.string().required("NFT contract is required").max(200),
  chain: yup.string().required("Chain is required"),
  paymentTokens: yup.string(),
  // processByWorker: yup.string().notRequired(),
  autoDetect: yup.boolean().notRequired(),
  enableSendExternalTransfer: yup.boolean().notRequired(),
  lockTransfer: yup
    .number()
    .typeError("Must be a number")
    .nullable()
    .transform((_, val) => (isNaN(Number(val)) ? 0 : Number(val))),
  twitter: yup
    .string()
    .max(200)
    .matches(/^(https:\/\/twitter.com\/).+$/, {
      message: "Invalid twitter url",
      excludeEmptyString: true,
    }),
  facebook: yup
    .string()
    .max(200)
    .matches(/^(https:\/\/facebook.com\/).+$/, {
      message: "Invalid facebook url",
      excludeEmptyString: true,
    }),
  discord: yup
    .string()
    .max(200)
    .matches(/^(https:\/\/discord.com\/).+$/, {
      message: "Invalid discord url",
      excludeEmptyString: true,
    }),
  telegram: yup
    .string()
    .max(200)
    .matches(/^(https:\/\/t.me\/).+$/, {
      message: "Invalid telegram url",
      excludeEmptyString: true,
    }),
  website: yup.string().max(200).url(),
  status: yup.string().oneOf(Object.values(Status)),
  verified: yup.boolean().notRequired(),
});
export default function AddCollection({
  collection,
  edit,
  title,
  onSuccess,
}: {
  collection?: NftCollectionDto;
  edit?: boolean;
  title: string;
  onSuccess?: () => void;
}) {
  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver,
    defaultValues: {
      cover: undefined,
      avatar: undefined,
      featuredImage: undefined,
      name: collection?.name,
      alias: collection?.key,
      nftContract: collection?.nftContract,
      chain: collection?.chain?.id,
      paymentTokens: collection?.paymentTokens?.join(","),
      // processByWorker: collection?.processByWorker,
      autoDetect: collection?.autoDetect,
      enableSendExternalTransfer: collection?.enableSendExternalTransfer,
      lockTransfer: collection?.lockTransfer,
      description: collection?.description,
      owner: collection?.owners ? collection?.owners[0] : undefined,
      status: collection?.status,
      verified: collection?.verified,
    },
  });
  const [loading, setLoading] = useState(false);
  const { swAlert } = useSwal();
  const router = useRouter();
  const onSubmit = async ({
    cover,
    avatar,
    featuredImage,
    name,
    alias,
    nftContract,
    game,
    chain,
    paymentTokens,
    // processByWorker,
    autoDetect,
    enableSendExternalTransfer,
    lockTransfer,
    description,
    owner,
    status,
    verified,
  }) => {
    try {
      setLoading(true);
      const payment = String(paymentTokens).split(",");
      const body: AddCollectionDto = {
        cover: cover ? cover[0] : undefined,
        avatar: avatar ? avatar[0] : undefined,
        featuredImage: featuredImage ? featuredImage[0] : undefined,
        name,
        key: alias,
        nftContract,
        game,
        chain,
        paymentTokens: payment,
        status,
        // processByWorker,
        autoDetect,
        enableSendExternalTransfer,
        lockTransfer,
        description,
        owners: [owner],
        verified,
      };
      if (!edit) {
        await nftService.createNftCollection(body);
      } else {
        await nftService.updateNftCollection(collection.id, body);
      }
      onSuccess && onSuccess();
      reset();
      swAlert({
        title: "COMPLETE",
        text: `Successfully!`,
        icon: "success",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Detail",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) router.push("/collection/" + alias);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const coverFile = watch("cover");
  const avatarFile = watch("avatar");
  const featuredImageFile = watch("featuredImage");
  const shortLinkLeftRef = useRef(null);
  const { chains } = useSelector(selectSystem);
  const [paymentTokens, setPaymentTokens] = useState<PaymentToken[]>([]);
  const collectionStatus = watch("status");
  const chain = watch("chain");
  useEffect(() => {
    setValue("paymentTokens", paymentTokens.map((p) => p.id).join(","));
  }, [paymentTokens]);
  useEffect(() => {
    setPaymentTokens([]);
    // setValue("processByWorker", chains.find((c) => c.id === chain)?.name);
  }, [chain]);
  useEffect(() => {
    if (collection) {
      setPaymentTokens((collection?.paymentTokens as PaymentToken[]) || []);
      collection?.chain && setValue("chain", collection?.chain?.id);
    }
  }, [collection]);
  return (
    <VStack w="full" spacing={5} alignItems="start">
      <Heading>{title}</Heading>
      <FormControl w="full" isInvalid={!!errors.avatar}>
        <FormLabel>Avatar</FormLabel>
        <FormHelperText mb={3} w="full">
          We recommend to upload images in 400x400 resolution. Max 5 MB in JPEG
          format
        </FormHelperText>
        <ChooseFileImage
          defaultImage={collection?.avatar}
          rounded="full"
          heigh="100%"
          maxW="200px"
          error={errors.avatar?.message?.toString()}
          coverFile={avatarFile}
        >
          <Input
            {...register("avatar")}
            display="none"
            type="file"
            accept="image/png,image/jpeg,image/gif/,image/jpg"
          />
        </ChooseFileImage>
      </FormControl>
      <FormControl isInvalid={!!errors.featuredImage}>
        <FormLabel>Featured image</FormLabel>
        <FormHelperText mb={3} w="full">
          This image will be used for featuring your collection on the homepage,
          category pages, or other promotional areas. We recommend to upload
          images in 600x400 resolution. Max 5 MB in JPEG format
        </FormHelperText>
        <ChooseFileImage
          defaultImage={collection?.featuredImage}
          heigh="66%"
          maxW="300px"
          error={errors.featuredImage?.message?.toString()}
          coverFile={featuredImageFile}
        >
          <Input
            {...register("featuredImage")}
            display="none"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/jpg"
          />
        </ChooseFileImage>
      </FormControl>
      <FormControl isInvalid={!!errors.cover}>
        <FormLabel>Cover</FormLabel>
        <FormHelperText mb={3} w="full">
          We recommend to upload images in 1440x360 resolution. Max 5 MB in JPEG
          format
        </FormHelperText>
        <ChooseFileImage
          defaultImage={collection?.cover}
          heigh="25%"
          maxW="1440px"
          error={errors.cover?.message?.toString()}
          coverFile={coverFile}
        >
          <Input
            {...register("cover")}
            display="none"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/jpg"
          />
        </ChooseFileImage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          {...register("name")}
          type="text"
          placeholder="Enter collection name"
          defaultValue={collection?.name}
        />
        <FormErrorMessage>{errors.name?.message?.toString()}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.alias}>
        <FormLabel>Short link</FormLabel>
        <InputGroup>
          <InputLeftElement ref={shortLinkLeftRef} w="fit-content">
            <Text>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {typeof window !== "undefined" &&
                `${window.location.protocol}//${window.location.host}/collection/`}
            </Text>
          </InputLeftElement>
          <Input
            pl={`${shortLinkLeftRef.current?.offsetWidth + 2 || 100}px`}
            {...register("alias")}
            type="text"
            placeholder="Input short url"
            defaultValue={collection?.key}
          />
        </InputGroup>
        <FormErrorMessage>{errors.alias?.message?.toString()}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.nftContract}>
        <FormLabel>Contract address</FormLabel>
        <Input
          {...register("nftContract")}
          type="text"
          placeholder="Enter contract address"
          defaultValue={collection?.nftContract}
          disabled={!!collection?.nftContract}
        />
        <FormErrorMessage>
          {errors.nftContract?.message?.toString()}
        </FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.owner}>
        <FormLabel>Owner address</FormLabel>
        <Input
          {...register("owner")}
          type="text"
          placeholder="Enter owner address"
          defaultValue={collection?.owners ? collection?.owners[0] : undefined}
          // disabled={!!(collection?.owners && collection?.owners[0])}
        />
        <FormErrorMessage>{errors.owner?.message?.toString()}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.description}>
        <FormLabel>Description</FormLabel>
        <Textarea {...register("description")} placeholder="About collection" />
        <FormErrorMessage>
          {errors.description?.message?.toString()}
        </FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.chain}>
        <FormLabel>Chain</FormLabel>
        <Select {...register("chain")}>
          {chains.map((c, index) => (
            <option key={`${c.id}-${c.name}`} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.chain?.message?.toString()}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.paymentTokens}>
        <FormLabel>Payment token</FormLabel>
        <Box display="inline-block" w="full">
          {paymentTokens.map((p) => (
            <Tag
              size="lg"
              mr={1}
              my={1}
              key={p.id}
              borderRadius="full"
              variant="solid"
            >
              <TagLabel>{p.symbol}</TagLabel>
              <TagCloseButton
                onClick={() => {
                  setPaymentTokens(
                    Array.from(
                      paymentTokens.filter((token) => token.id !== p.id)
                    )
                  );
                }}
              />
            </Tag>
          ))}
          <Menu>
            <MenuButton
              mr={1}
              my={1}
              rounded="full"
              size="sm"
              as={Button}
              rightIcon={<Icon as={FiPlus} />}
            >
              Add
            </MenuButton>
            <MenuList>
              <ChoosePaymentToken
                chain={chain}
                selected={paymentTokens}
                onChange={(p) => {
                  setPaymentTokens(
                    Array.from([
                      ...paymentTokens.filter((token) => token.id !== p.id),
                      p,
                    ])
                  );
                }}
              />
            </MenuList>
          </Menu>
        </Box>
        <Input type="hidden" {...register("paymentTokens")} />
        {!errors.paymentTokens && (
          <FormHelperText>
            Input token symbol or contract address to search payment token.
          </FormHelperText>
        )}
        <FormErrorMessage>
          {errors.paymentTokens?.message?.toString()}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.verified}>
        <FormLabel>Verified</FormLabel>
        <Checkbox checked={collection?.verified} {...register("verified")} />
        <FormErrorMessage>
          {errors.verified?.message?.toString()}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.autoDetect}>
        <FormLabel>Auto detect</FormLabel>
        <Checkbox
          checked={collection?.autoDetect}
          {...register("autoDetect")}
        />
        {!errors.autoDetect && (
          <FormHelperText>Auto detect onchain event.</FormHelperText>
        )}
        <FormErrorMessage>
          {errors.autoDetect?.message?.toString()}
        </FormErrorMessage>
      </FormControl>
      {/* <FormControl isInvalid={!!errors.processByWorker}>
        <FormLabel>Worker process</FormLabel>
        <Input
          defaultValue={collection?.processByWorker}
          key={`worker-${chain}`}
          {...register("processByWorker")}
        />
        {!errors.processByWorker && (
          <FormHelperText>
            Name of worker to process onchain event. Default is name of chain.
          </FormHelperText>
        )}
        <FormErrorMessage>
          {errors.processByWorker?.message?.toString()}
        </FormErrorMessage>
      </FormControl> */}
      <FormControl isInvalid={!!errors.enableSendExternalTransfer}>
        <FormLabel> Enable lock transfer</FormLabel>
        <Checkbox
          checked={collection?.enableSendExternalTransfer}
          {...register("enableSendExternalTransfer")}
        />
        {!errors.enableSendExternalTransfer && (
          <FormHelperText>
            Enable lock when transfer NFT outside marketplace.
          </FormHelperText>
        )}
        <FormErrorMessage>
          {errors.enableSendExternalTransfer?.message?.toString()}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.lockTransfer}>
        <FormLabel>Lock transfer time</FormLabel>
        <Input
          defaultValue={collection?.lockTransfer}
          placeholder="Input a number"
          type="number"
          {...register("lockTransfer")}
        />
        {!errors.lockTransfer && (
          <FormHelperText>Lock transfer time in seconds.</FormHelperText>
        )}
        <FormErrorMessage>
          {errors.lockTransfer?.message?.toString()}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.status}>
        <FormLabel> Status</FormLabel>
        <RadioGroup
          onChange={(v) => {
            setValue("status", v);
          }}
          value={collectionStatus || collection?.status}
        >
          <Stack direction="row">
            {Object.values(Status).map((v) => (
              <Radio value={v}>{v}</Radio>
            ))}
          </Stack>
        </RadioGroup>
        <Input type="hidden" {...register("status")} />

        <FormErrorMessage>
          {errors.status?.message?.toString()}
        </FormErrorMessage>
      </FormControl>
      <PrimaryButton isLoading={loading} onClick={handleSubmit(onSubmit)}>
        {edit ? "Edit collection" : "Create collection"}
      </PrimaryButton>
    </VStack>
  );
}
