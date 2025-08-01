// ChatWindow.tsx
import { useSelector } from "react-redux";
import { RootState } from "../stores/stores";
import Message from "./Message";
import { Box, defineStyle, Flex, Avatar, Text } from "@chakra-ui/react";

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
})

export const ChatWindow = () => {
  const chat = useSelector((state: RootState) => state.chat);
  const isThinking = useSelector((state: RootState) => state.chat.thinking);

  return (
    <Box 
      // maxH="80vh" 
      // overflowY="auto" 
      p={4} 
      flexDirection="row"
      mx="auto"         // Center horizontally
      position="relative"
      right="-20px"
      marginLeft="0px"
      marginRight="0px"
    >
      {chat.messages.map((msg) => (
        <Message key={msg.id} {...msg} />
      ))}

      {isThinking && (
        <Flex alignItems="flex-start" justify="flex-start" gap={2}>
          <Avatar size="sm" css={ringCss} color="pink" src="/assets/images/aaronoah.jpg" />
          <Text fontStyle="italic" color="gray.500">Thinking...</Text>
        </Flex>
      )}
    </Box>
  );
};
