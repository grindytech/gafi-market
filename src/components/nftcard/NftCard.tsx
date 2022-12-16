import {
  Box,
  BoxProps,
  Heading,
  HStack,
  useBreakpointValue,
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
  mask?: any;
};

export default function NftCard({
  loading,
  image,
  videoUri,
  children,
  showOnHover,
  mask,
  ...rest
}: Props & BoxProps) {
  const cardStyles = useStyleConfig("NFTCard");
  const imageStyles = useStyleConfig("NFTCardImage");
  const videoRef = useRef<any>(null);
  const md = useBreakpointValue({ base: false, md: true });

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
        {...rest}
      >
        <CardBody>
          <VStack w="full" spacing={0}>
            <Box
              overflow="hidden"
              w="full"
              paddingTop="100%"
              position="relative"
            >
              <Skeleton isLoaded={!loading}>
                <Box
                  position="absolute"
                  rounded="xl"
                  w="full"
                  h="full"
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  justifyContent="center"
                  alignItems="center"
                  display="flex"
                >
                  <HStack
                    position="absolute"
                    top={0}
                    left={0}
                    w="full"
                    h="full"
                    zIndex={2}
                  >
                    {mask}
                  </HStack>
                  {showOnHover && !loading && (
                    <HStack
                      className="hover-show"
                      position="absolute"
                      top={0}
                      left={0}
                      w="full"
                      h="full"
                      zIndex={3}
                    >
                      {showOnHover}
                    </HStack>
                  )}

                  <LazyImage
                    className={videoUri && "hover-hidden"}
                    data-component-name="NFTImage"
                    __css={imageStyles}
                    src={image}
                    h="full"
                    objectFit="contain"
                  />
                  {videoUri && (
                    <video className="hover-show" ref={videoRef} height="280px">
                      <source src={videoUri} />
                    </video>
                  )}
                </Box>
              </Skeleton>
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
