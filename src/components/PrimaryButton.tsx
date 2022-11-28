import { Button, ButtonProps } from "@chakra-ui/react";

export default function PrimaryButton({ children,...rest }: ButtonProps) {
  return (
    <Button
      variant="solid"
      colorScheme="primary"
      bg="primary.500"
      color="gray.50"
      {...rest}
    >
      {children}
    </Button>
  );
}
