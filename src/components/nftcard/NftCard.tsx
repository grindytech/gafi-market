import {
  Box,
  BoxProps,
  Button,
  HStack,
  Icon,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BiPause, BiPlay } from "react-icons/bi";
import { BsBox } from "react-icons/bs";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import FloatIconWithText from "../FloatIconWithText";
import LazyImage, { ImageWithFallback } from "../LazyImage";
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
  bgImage?: string;
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
  bgImage,
  ...rest
}: Props & BoxProps) {
  const cardStyles = cardStyle === "nftCard" ? useStyleConfig("NFTCard") : {};
  const imageStyles = useStyleConfig("NFTCardImage");
  const videoRef = useRef<any>(null);
  const bgColor =
    cardStyle === "nftCard" ? useColorModeValue("white", "gray.800") : "none";
  const md = useBreakpointValue({ base: false, md: true });
  const [videoPlaying, setVideoPlaying] = useState(false);
  return (
    <Box w="full">
      <Card
        opacity={disabled ? 0.5 : 1}
        p={0}
        __css={cardStyles}
        borderColor={bgColor}
        bg={bgColor}
        {...rest}
        rounded="xl"
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
                    {showOnHover && md && !loading && (
                      <HStack
                        className={"hover-show"}
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
                      <>
                        <div
                          style={{
                            visibility: videoPlaying ? "visible" : "hidden",
                          }}
                        >
                          <video
                            onPause={() => {
                              setVideoPlaying(false);
                            }}
                            onPlay={() => {
                              setVideoPlaying(true);
                            }}
                            ref={videoRef}
                            height="280px"
                            loop={true}
                          >
                            <source src={videoUri} />
                          </video>
                        </div>
                        <IconButton
                          rounded="full"
                          aria-label="play"
                          zIndex={9}
                          position="absolute"
                          top={2}
                          right={2}
                          backdropFilter="blur(30px)"
                          bgColor="rgba(255, 255, 255, 0.2)"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            if (!videoRef?.current) return;
                            if (videoPlaying) {
                              videoRef.current.pause();
                            } else {
                              videoRef.current.play();
                            }
                          }}
                        >
                          <Icon
                            color="gray.300"
                            as={videoPlaying ? BiPause : BiPlay}
                          />
                        </IconButton>
                      </>
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

                    {bgImage ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        w="full"
                        h="full"
                        position="relative"
                      >
                        <Box
                          position="absolute"
                          w="full"
                          h="full"
                          bgImage={bgImage}
                          bgPosition="center center"
                          bgSize="cover"
                          filter={bgImage ? "blur(30px)" : "none"}
                        ></Box>
                        <Box
                          zIndex={3}
                          overflow="hidden"
                          w="100px"
                          h="100px"
                          rounded="full"
                        >
                          <ImageWithFallback
                            objectFit="cover"
                            src={image}
                            w="100px"
                            h="100px"
                            rounded="full"
                          />
                        </Box>
                      </Box>
                    ) : (
                      !videoPlaying && (
                        <LazyImage
                          borderTopRadius="xl"
                          __css={imageStyles}
                          src={image}
                          h="full"
                          objectFit="contain"
                        />
                      )
                    )}
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
