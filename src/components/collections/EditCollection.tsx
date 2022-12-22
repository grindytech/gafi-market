import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useYupValidationResolver from "../../hooks/useYupValidationResolver";
import { selectSystem } from "../../store/systemSlice";
import { checkIfFilesAreTooBig } from "../../utils/utils";
import ChooseFileImage from "../ChooseFileImage";
import PrimaryButton from "../PrimaryButton";
import { AsyncSelect, chakraComponents } from "chakra-react-select";
import nftService from "../../services/nft.service";
import { GetNftCollections } from "../../services/types/params/GetNftCollections";
// export function checkIfFilesAreCorrectType(files?: [File]): boolean {
//   let valid = true;
//   if (files) {
//     files.map((file) => {
//       if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
//         valid = false;
//       }
//     });
//   }
//   return valid;
// }
// These are the defaults for each of the custom props
const asyncComponents = {
  LoadingIndicator: (props) => (
    <chakraComponents.LoadingIndicator
      // The color of the main line which makes up the spinner
      // This could be accomplished using `chakraStyles` but it is also available as a custom prop
      color="currentColor" // <-- This default's to your theme's text color (Light mode: gray.700 | Dark mode: whiteAlpha.900)
      // The color of the remaining space that makes up the spinner
      emptyColor="transparent"
      // The `size` prop on the Chakra spinner
      // Defaults to one size smaller than the Select's size
      spinnerSize="md"
      // A CSS <time> variable (s or ms) which determines the time it takes for the spinner to make one full rotation
      speed="0.45s"
      // A CSS size string representing the thickness of the spinner's line
      thickness="2px"
      // Don't forget to forward the props!
      {...props}
    />
  ),
};
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
    .test("avatar-size", "Max size is 5mb", (files) =>
      checkIfFilesAreTooBig(files, 5)
    ),
  name: yup.string().required().max(200),
  alias: yup.string().required().max(200),
  nftContract: yup.string().required().max(200),
  game: yup.string().required(),
  chain: yup.string().required(),
  paymentTokens: yup.array().required(),
});
const colourOptions = [
  {
    label: "I can't be removed",
    value: "fixed",
    isFixed: true,
  },
  {
    label: "I can be removed",
    value: "not-fixed",
  },
];
export default function EditCollection() {
  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({ resolver });
  const onSubmit = (data) => console.log(data);
  const coverFile = watch("cover");
  const avatarFile = watch("avatar");
  const featuredImageFile = watch("featuredImage");
  const shortLinkLeftRef = useRef(null);
  const { chains } = useSelector(selectSystem);
  return (
    <VStack w="full" spacing={5} alignItems="start">
      <Heading>Create collection</Heading>
      <FormControl w="full" isInvalid={!!errors.avatar}>
        <FormLabel>Avatar</FormLabel>
        <FormHelperText mb={3} w="full">
          We recommend to upload images in 400x400 resolution. Max 5 MB in JPEG
          format
        </FormHelperText>
        <ChooseFileImage
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
            accept="image/png,image/jpeg,image/gif"
          />
        </ChooseFileImage>
      </FormControl>
      <FormControl isInvalid={!!errors.featuredImage}>
        <FormLabel>Featured image</FormLabel>
        <FormHelperText mb={3} w="full">
          This image will be used for featuring your collection on the homepage,
          category pages, or other promotional areas. We recommend to upload
          images in 400x400 resolution. Max 5 MB in JPEG format
        </FormHelperText>
        <ChooseFileImage
          heigh="66%"
          maxW="300px"
          error={errors.featuredImage?.message?.toString()}
          coverFile={featuredImageFile}
        >
          <Input
            {...register("featuredImage")}
            display="none"
            type="file"
            accept="image/png,image/jpeg,image/gif"
          />
        </ChooseFileImage>
      </FormControl>
      <FormControl isInvalid={!!errors.cover}>
        <FormLabel>Cover</FormLabel>
        <FormHelperText mb={3} w="full">
          We recommend to upload images in 400x400 resolution. Max 5 MB in JPEG
          format
        </FormHelperText>
        <ChooseFileImage
          heigh="25%"
          maxW="1440px"
          error={errors.cover?.message?.toString()}
          coverFile={coverFile}
        >
          <Input
            {...register("cover")}
            display="none"
            type="file"
            accept="image/png,image/jpeg,image/gif"
          />
        </ChooseFileImage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          {...register("name")}
          type="text"
          placeholder="Enter collection name"
        />
        <FormErrorMessage>{errors.name?.message?.toString()}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.alias}>
        <FormLabel>Short link</FormLabel>
        <InputGroup>
          <InputLeftElement ref={shortLinkLeftRef} w="fit-content">
            <Text color="whiteAlpha.400">
              &nbsp;&nbsp;&nbsp;&nbsp;
              {`${window.location.protocol}//${window.location.host}/collection/`}
            </Text>
          </InputLeftElement>
          <Input
            pl={`${shortLinkLeftRef.current?.offsetWidth + 2 || 100}px`}
            {...register("alias")}
            type="text"
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
        />
        <FormErrorMessage>
          {errors.nftContract?.message?.toString()}
        </FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.chain}>
        <FormLabel>Chain</FormLabel>
        <Select>
          {chains.map((c, index) => (
            <option value={c.id}>{c.name}</option>
          ))}
        </Select>
        <FormErrorMessage>{errors.chain?.message?.toString()}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Payment token</FormLabel>
        <AsyncSelect
          isMulti
          name="colors"
          placeholder="0x000..."
          components={asyncComponents}
          loadOptions={(inputValue, callback) => {
            const isAddress = String(inputValue).match(/^0x.+$/i);
            const param = new GetNftCollections();
            if (isAddress) { 
              // param.;
            }
            // nftService.getNftCollections()
              // callback(values);
          }}
        />
        <FormHelperText>
          Input token symbol or contract address to search payment token.
        </FormHelperText>
      </FormControl>

      <PrimaryButton onClick={handleSubmit(onSubmit)}>Submit</PrimaryButton>
    </VStack>
  );
}
