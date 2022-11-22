import { Box, Image, ImageProps, Skeleton } from "@chakra-ui/react";
import LazyLoad from "react-lazyload";
import { Images } from "../images";
export default function LazyImage({ w, h, ...rest }: ImageProps) {
  return (
    <LazyLoad
      once={true}
      placeholder={
        <Skeleton>
          <Image w={w} h={h} {...rest} />
        </Skeleton>
      }
    >
      <ImageWithFallback w={w} h={h} {...rest} />
    </LazyLoad>
  );
}

export function ImageWithFallback({ w, h, ...rest }: ImageProps) {
  return (
    <Image
      w={w}
      h={h}
      {...rest}
      fallback={
        <Box
          w={w}
          h={h}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            src={Images.Placeholder.src}
            alt=""
            style={{
              maxWidth: "50%",
              maxHeight: "50%",
            }}
          />
        </Box>
      }
    />
  );
}
