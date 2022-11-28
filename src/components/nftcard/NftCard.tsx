import {
  Box,
  Heading,
  HStack,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import LazyImage from "../LazyImage";
import Skeleton from "../Skeleton";

type Props = {
  image: string;
  videoUri?: string;
  children?: any;
  showOnHover?: any;
  loading?: boolean;
};

export default function NftCard({
  loading,
  image,
  videoUri,
  children,
  showOnHover,
}: Props) {
  const cardStyles = useStyleConfig("NFTCard");
  const imageStyles = useStyleConfig("NFTCardImage");
  const videoRef = useRef<any>(null);
  return (
    <Box w="full">
      <Card
        p={0}
        rounded="xl"
        __css={cardStyles}
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        bg={useColorModeValue("white", "gray.900")}
        onMouseEnter={() => {
          if (!videoRef?.current) return;
          videoRef.current.play();
        }}
        onMouseLeave={() => {
          if (!videoRef?.current) return;
          videoRef.current.load();
        }}
      >
        <CardBody>
          <VStack w="full">
            <Box p={3}>
              <Box
                rounded="2xl"
                // bg={useColorModeValue("gray.800", "gray.800")}
                pos={"relative"}
                w="full"
                height={"300px"}
                overflow="hidden"
                justifyContent="center"
                alignItems="center"
                display="flex"
              >
                {showOnHover && (
                  <HStack
                    className="hover-show"
                    position="absolute"
                    top={0}
                    left={0}
                    w="full"
                    h="full"
                    zIndex={2}
                  >
                    {showOnHover}
                  </HStack>
                )}
                <Skeleton isLoaded={!loading}>
                  <LazyImage
                    className={videoUri && "hover-hidden"}
                    data-component-name="NFTImage"
                    __css={imageStyles}
                    h="300px"
                    src={image}
                    rounded="2xl"
                    objectFit="cover"
                  />
                  {videoUri && (
                    <video className="hover-show" ref={videoRef} height="300px">
                      <source src={videoUri} />
                    </video>
                  )}
                </Skeleton>
              </Box>
            </Box>
            <VStack w="full" spacing={0} alignItems="start">
              {children}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
