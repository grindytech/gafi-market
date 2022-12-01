import { Box, Image, ImageProps, Skeleton } from "@chakra-ui/react";
import LazyLoad from "react-lazyload";
import { Images } from "../images";
export default function LazyImage({
  w,
  h,
  ...rest
}: ImageProps ) {
  return (
    // <LazyLoad
    //   style={{
    //     width: w,
    //     height: h,
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    //   once={true}
    //   placeholder={
    //     <Skeleton>
    //       <Image w={w} h={h} {...rest} />
    //     </Skeleton>
    //   }
    // >
    //   <ImageWithFallback w={w} h={h} {...rest} />
    // </LazyLoad>
    <ImageWithFallback w={w} h={h} {...rest} />
  );
}

export function ImageWithFallback({ w, h, ...rest }: ImageProps) {
  return (
    <Image
      w={w}
      h={h}
      {...rest}
      fallback={
        <Image
          src={Images.Placeholder.src}
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      }
    />
  );
}
