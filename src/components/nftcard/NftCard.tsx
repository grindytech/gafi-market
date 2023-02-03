import {
  Box,
  BoxProps,
  Button,
  HStack,
  Icon,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { BsBox } from "react-icons/bs";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import FloatIconWithText from "../FloatIconWithText";
import LazyImage from "../LazyImage";
import Skeleton from "../Skeleton";

type Props = {
  image: string;
  videoUri?: string;
  children?: any;
  showOnHover?: any;
  loading?: boolean;
  mask?: any;
  disabled?: boolean;
  bundle?: string;
  cardStyle?: "unstyle" | "nftCard";
};

export default function NftCard({
  loading,
  image,
  videoUri,
  children,
  showOnHover,
  mask,
  disabled,
  bundle,
  cardStyle = "nftCard",
  ...rest
}: Props & BoxProps) {
  const cardStyles = cardStyle === "nftCard" ? useStyleConfig("NFTCard") : {};
  const imageStyles = useStyleConfig("NFTCardImage");
  const videoRef = useRef<any>(null);
  const bgColor =
    cardStyle === "nftCard"
      ? useColorModeValue("white", "gray.800")
      : "none";
  return (
    <Box w="full">
      <Card
        opacity={disabled ? 0.5 : 1}
        p={0}
        rounded="xl"
        __css={cardStyles}
        borderColor={useColorModeValue("gray.200", "gray.700")}
        bg={bgColor}
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
              overflow="visible"
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
                  <Box>
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
                    {videoUri && (
                      <video
                        className="hover-show"
                        ref={videoRef}
                        height="280px"
                      >
                        <source src={videoUri} />
                      </video>
                    )}
                  </Box>
                  <Box
                    w="full"
                    h="full"
                    position="absolute"
                    data-component-name={disabled ? "" : "NFTImage"}
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
                    <LazyImage
                      className={videoUri && "hover-hidden"}
                      __css={imageStyles}
                      src={image}
                      h="full"
                      objectFit="contain"
                    />
                  </Box>
                </Box>
              </Skeleton>
            </Box>
            <VStack w="full" spacing={0} alignItems="start">
              {bundle && (
                <Box zIndex={3} p={3} position="absolute" top={0} left={0}>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(`/bundle/${bundle}`, "_blank");
                    }}
                    size="xs"
                    variant="unstyled"
                  >
                    <FloatIconWithText title="Go to bundle" h={6} w={6}>
                      <Icon w={4} h={4} as={BsBox} />
                    </FloatIconWithText>
                  </Button>
                </Box>
              )}
              {children}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
