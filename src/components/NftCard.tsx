import {
  Box,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import Icons from "../images";
import Card from "./card/Card";
import CardBody from "./card/CardBody";
import FloatIconWithText from "./FloatIconWithText";
import LazyImage from "./LazyImage";

export default function NftCard({ image }: { image: string }) {
  const cardStyles = useStyleConfig("NFTCard");
  const imageStyles = useStyleConfig("NFTCardImage");

  return (
    <Box w="full">
      <Card
        rounded="xl"
        __css={cardStyles}
        border="3px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        p={5}
        bg={useColorModeValue("white", "gray.900")}
      >
        <CardBody>
          <VStack w="full">
            <Box
              rounded="2xl"
              // bg={useColorModeValue("gray.800", "gray.800")}
              pos={"relative"}
              w="full"
              height={"300px"}
              overflow="visible"
              justifyContent="center"
              alignItems="center"
              display="flex"
              mb={5}
              mt={1}
            >
              <HStack position="absolute" top={2} left={2}>
                <FloatIconWithText w={8} h={8}>
                  <Icon w={6} h={6}>
                    <Icons.chain.DOS />
                  </Icon>
                </FloatIconWithText>
                <FloatIconWithText w={8} h={8} title="Heroes & empires">
                  <Icon w={6} h={6}>
                    <Icons.token.HE />
                  </Icon>
                </FloatIconWithText>
              </HStack>
              <LazyImage
                data-component-name="NFTImage"
                __css={imageStyles}
                h="300px"
                w="auto"
                src={image}
                rounded="2xl"
                objectFit='cover'
              />
            </Box>
            <VStack w="full" spacing={1} alignItems="start">
              <Heading fontSize={{ base: "md", md: "2md", lg: "3md" }}>
                Ares #12121
              </Heading>
              <Heading fontSize={{ base: "lg", md: "2lg", lg: "3lg" }}>
                0.3 BNB
              </Heading>
              <Text fontSize="sm" colorScheme="gray">
                Last sale: 0.22 BNB
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
