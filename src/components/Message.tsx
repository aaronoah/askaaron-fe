import { Box, Flex, Text } from "@chakra-ui/react";

type MessageProps = {
  sender: "user" | "assistant";
  content: string;
  timestamp?: string;
};

const Message = ({ sender, content, timestamp }: MessageProps) => {
  const isUser = sender === "user";

  return (
    <Flex
      justify={isUser ? "flex-end" : "flex-start"}
      mb={10}
      px={2}
    >
      <Box
        color="white"
        bg={isUser ? "gray.100" : "transparent"}
        px={4}
        py={2}
        borderRadius="xl"
        maxW="600px"
        whiteSpace="pre-wrap"
      >
        <Text fontSize={isUser ? "sm" : "lg"} color="gray.900">{content}</Text>
      </Box>
    </Flex>
  );
};

export default Message;
