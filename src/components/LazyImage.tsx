import { Image, ImageProps } from "@chakra-ui/react";
import { useState } from "react";
import { Images } from "../images";
import Skeleton from "./Skeleton";
export default function LazyImage({ w, h, ...rest }: ImageProps) {
  return <ImageWithFallback w={w} h={h} {...rest} />;
}

export function ImageWithFallback({
  w,
  h,
  zIndex,
  ...rest
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Skeleton w={w} h={h} zIndex={zIndex} isLoaded={!isLoading}>
      <Image
        onLoad={() => {
          setIsLoading(false);
        }}
        onError={() => {
          setIsLoading(false);
        }}
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
            w={w}
            h={h}
            objectFit='contain'
          />
        }
      />
    </Skeleton>
  );
}
