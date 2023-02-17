import { Box, Heading, Text } from "@chakra-ui/react";
import { NextPageContext } from "next";
import Link from "next/link";

function Error({ statusCode, statusMessage }) {
  return (
    <Box id="main" textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, red.400, red.600)"
        backgroundClip="text"
      >
        {statusCode}
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        {statusMessage}
      </Text>
      <Text color={"gray.500"} mb={6}>
        Please <Link href={window.location.href}>try again</Link>!
      </Text>
    </Box>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = err ? err.statusCode : res ? res.statusCode : 404;
  const statusMessage = err
    ? err.message
    : res
    ? res.statusMessage
    : "Oops, something went wrong.";
  return { statusCode, statusMessage };
};

export default Error;
