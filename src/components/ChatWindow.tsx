// ChatWindow.tsx
import { useSelector } from "react-redux";
import { RootState } from "../stores/stores";
import Message from "./Message";
import { Box } from "@chakra-ui/react";

export const ChatWindow = () => {
  const chat = useSelector((state: RootState) => state.chat);

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
    </Box>
  );
};
