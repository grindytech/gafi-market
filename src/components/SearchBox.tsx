import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import _ from "lodash";
import { useRef } from "react";

type Props = {
  isLoading?: boolean;
  placeHolder?: string;
  value?: string;
  onChange?: (v: string) => void;
  inputGroupProps?: InputGroupProps;
  inputProps?: InputProps;
};
export default function SearchBox({
  isLoading,
  onChange,
  placeHolder,
  value,
  inputGroupProps,
  inputProps,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <InputGroup size="md" w="full" {...inputGroupProps}>
      <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
      <Input
        ref={inputRef}
        variant="filled"
        placeholder={placeHolder}
        _focusVisible={{
          borderColor: "primary.300",
          borderWidth: "1px",
        }}
        // value={value}
        onChange={_.debounce((e) => {
          onChange && onChange(e.target.value);
        }, 300)}
        {...inputProps}
      />
      {value && (
        <InputRightElement
          children={
            <IconButton
              size="xs"
              isLoading={isLoading}
              aria-label="delete"
              onClick={() => {
                onChange && onChange(undefined);
                inputRef.current.value = "";
              }}
            >
              <CloseIcon />
            </IconButton>
          }
        />
      )}
    </InputGroup>
  );
}
