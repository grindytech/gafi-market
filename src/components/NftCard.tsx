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
const IMAGE = "https://d343muqqn13tb8.cloudfront.net/heroes/Ares.png";

export default function NftCard() {
  const cardStyles = useStyleConfig("NFTCard");
  const imageStyles = useStyleConfig("NFTCardImage");

  return (
    <Box w="full" pb={3}>
      <Card rounded="lg" p={1} __css={cardStyles}>
        <CardBody rounded="lg" overflow="hidden">
          <VStack w="full">
            <Box
              bg={useColorModeValue("gray.800", "gray.800")}
              pos={"relative"}
              w="full"
              height={"300px"}
              overflow="hidden"
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
                h={300}
                w="full"
                src={IMAGE}
              />
            </Box>
            <VStack p={3} w="full" spacing={1} alignItems="start">
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
