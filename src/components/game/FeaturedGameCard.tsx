import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import { ImageWithFallback } from "../LazyImage";
const IMAGE =
  "https://liquidifty.imgix.net/QmXSgpjF9SdNz3Rjqs6cTKfGaRRE3iupF6W3iYp9CpCCNW?auto=compress,format";

export default function FeaturedGameCard() {
  const cardStyles = useStyleConfig("NFTCard");
  const imageStyles = useStyleConfig("NFTCardImage");
  return (
    <Box pr={3} pb={5} w="fit-content">
      <Card p={0} __css={cardStyles}>
        <CardBody>
          <Box
            pos={"relative"}
            height={"230px"}
            overflow="hidden"
            bg={useColorModeValue("gray.600", "gray.800")}
            // rounded="xl"
            w={400}
            h={300}
            maxW="full"
            // border={"1px solid"}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <ImageWithFallback
              data-component-name="NFTImage"
              __css={imageStyles}
              h="full"
              w="full"
              src={IMAGE}
            />
            <VStack
              pos="absolute"
              w="full"
              h="full"
              top={0}
              left={0}
              justifyContent="space-between"
              alignItems="start"
              px={2}
              zIndex={2}
              color="white"
              // textShadow="0.1px 0.1px #fff"
              p={3}
              // fontFamily="mono"
              bgGradient={["linear(to-b, rgba(0,0,0,0), rgba(0,0,0,0.3))"]}
            >
              <Button
                color="white"
                colorScheme={"black"}
                size="xs"
                alignItems="center"
                bg="rgba(20,20,20,0.5)"
                variant="ghost"
              >
                <FiUser />
                <Text lineHeight="1rem">&nbsp;21k Players</Text>
              </Button>
              <VStack w="full" alignItems="start">
                <Text brightness="150%" fontSize="2xl" fontWeight="semibold">
                  Heroes & Empires
                </Text>
                <Divider borderColor="gray.300" />
                <HStack
                  w="full"
                  spacing={2}
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  <HStack spacing={1}>
                    <Text color="gray.300">Vol:</Text>
                    <Text color="gray.50">$100m</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Text color="gray.300">Sale:</Text>
                    <Text color="gray.50">3k</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Text color="gray.300">Sold:</Text>
                    <Text color="gray.50">3k</Text>
                  </HStack>
                </HStack>
              </VStack>
            </VStack>
            {/* <VStack
              data-component-name="ShowOnHover"
              pos="absolute"
              w="full"
              h="full"
              bg="rgba(0,0,0,0)"
              visibility="hidden"
              zIndex={3}
            ></VStack> */}
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
