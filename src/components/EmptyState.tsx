import {
  Heading,
  Icon,
  StackProps,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineInbox, AiOutlineWarning } from "react-icons/ai";

type Props = StackProps & { msg?: string; icon?: any };
export default function Msg({ msg, children, icon, ...rest }: Props) {
  return (
    <VStack
      {...rest}
      alignItems="center"
      justifyContent="center"
      w="full"
      // height="200"
    >
      {React.cloneElement(icon)}
      <Heading fontSize="lg">{msg}</Heading>
      {children}
    </VStack>
  );
}

export function EmptyState({ msg, icon, children, ...rest }: Props) {
  const textColor = useColorModeValue("gray.500", "gray.300");

  return (
    <Msg
      textColor={textColor}
      {...rest}
      msg={msg ?? "No result found."}
      icon={icon ?? <Icon as={AiOutlineInbox} w={20} h={20} />}
    >
      {children}
    </Msg>
  );
}

export function ErrorState({ msg, icon, children, ...rest }: Props) {
  const textColor = useColorModeValue("gray.500", "gray.300");

  return (
    <Msg
      textColor={textColor}
      {...rest}
      msg={msg ?? "Something when wrong!"}
      icon={icon ?? <Icon as={AiOutlineWarning} w={20} h={20} />}
    >
      {children}
    </Msg>
  );
}
