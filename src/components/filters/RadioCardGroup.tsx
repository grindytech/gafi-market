import {
  Box,
  HStack,
  Icon,
  Stack,
  StackProps,
  Text,
  useRadioGroup,
} from "@chakra-ui/react";
import React from "react";
import Icons from "../../images";
import RadioCard from "./RadioCard";
type RadioOption = {
  label: string;
  value: string;
  icon?: any;
  defaultChecked?: boolean;
};
export default function RadioCardGroup({
  onChange,
  options,
  ...rest
}: StackProps & { options: RadioOption[]; onChange?: (val: string) => void }) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: "react",
    onChange: onChange,
  });

  const group = getRootProps();

  return (
    <Stack {...group} {...rest}>
      {options.map(({ value, label, icon, defaultChecked }) => {
        const radio = getRadioProps({ value });
        return (
          <Box pb={2} pr={2} key={`ChooseBlockchain-${value}`}>
            <RadioCard
              isChecked={defaultChecked}
              defaultChecked={defaultChecked}
              value={value}
              key={value}
              {...radio}
            >
              <HStack spacing={1} alignItems="center" height="2em">
                {React.cloneElement(icon)}
                <Text lineHeight="1rem">{label}</Text>
              </HStack>
            </RadioCard>
          </Box>
        );
      })}
    </Stack>
  );
}
