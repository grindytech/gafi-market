import { Box, RadioProps, useRadio } from "@chakra-ui/react";

export default function RadioCard(props: RadioProps) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "primary.600",
          color: "white",
          borderColor: "primary.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={2}
        py={1}
      >
        {props.children}
      </Box>
    </Box>
  );
}
