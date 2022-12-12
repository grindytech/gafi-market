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
          <VStack w="full" spacing={0}>
            <Box
              overflow="visible"
              m={2}
              rounded="xl"
              pos={"relative"}
              h={[200, 220, 280]}
              justifyContent="center"
              alignItems="center"
              display="flex"
            >
              {showOnHover && !loading && (
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

              <LazyImage
                className={videoUri && "hover-hidden"}
                data-component-name="NFTImage"
                __css={imageStyles}
                src={image}
                w="full"
                objectFit="contain"
              />
              {videoUri && (
                <video className="hover-show" ref={videoRef} height="280px">
                  <source src={videoUri} />
                </video>
              )}
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
