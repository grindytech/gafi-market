import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RiImageAddLine } from "react-icons/ri";

type Props = {
  maxW: string;
  heigh: string;
  error?: string;
  coverFile: [File];
  children: any;
  rounded?: string;
  defaultImage?: string;
};
export default function ChooseFileImage({
  heigh,
  maxW,
  error,
  coverFile,
  children,
  rounded,
  defaultImage,
}: Props) {
  const [coverBg, setCoverBg] = useState<string>();
  useEffect(() => {
    if (coverFile && coverFile[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        setCoverBg("url('" + e.target.result + "')");
      };
      reader.readAsDataURL(coverFile[0]);
    } else {
      setCoverBg(undefined);
    }
  }, [coverFile]);
  const color = useColorModeValue("gray.500", "gray.200");
  return (
    <>
      <FormLabel maxW={maxW}>
        <VStack spacing={1} alignItems="start">
          <Box position="relative" w="full" maxW={maxW} paddingTop={heigh}>
            <Box
              p={1}
              cursor="pointer"
              rounded={rounded || "lg"}
              borderStyle="dashed"
              borderWidth={2}
              position="absolute"
              w="full"
              h="full"
              top={0}
              left={0}
              borderColor={color}
            >
              <VStack
                rounded={rounded || "lg"}
                w="full"
                h="full"
                spacing={0}
                justifyContent="center"
                alignItems="center"
                display="flex"
                backgroundImage={(!error ? coverBg : undefined) || defaultImage}
                bgRepeat="no-repeat"
                bgSize="cover"
                bgPosition="center"
                overflow="hidden"
              >
                {/* {coverBg && !error && (
                  <IconButton
                    onClick={() => {
                      remove();
                    }}
                    position="absolute"
                    top={2}
                    right={2}
                    size="sm"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                )} */}
                {(!coverBg || !!error) && (
                  <VStack justifyContent="center" w="full" spacing={0}>
                    <Icon color={color} as={RiImageAddLine} w="12" h="12" />
                    {/* {coverFile && coverFile[0] && (
                    <Text
                      textAlign="center"
                      w="full"
                      noOfLines={1}
                      fontSize="md"
                    >
                      {coverFile[0].name}
                    </Text>
                  )} */}
                    <Box w="full" px={5} textAlign="center">
                      {/* <FormHelperText fontSize="xs">
                        {helperText}
                      </FormHelperText> */}
                      <FormErrorMessage justifyContent="center" w="full">
                        {error}
                      </FormErrorMessage>
                    </Box>
                  </VStack>
                )}
              </VStack>
            </Box>
          </Box>
        </VStack>
      </FormLabel>
      {children}
    </>
  );
}
