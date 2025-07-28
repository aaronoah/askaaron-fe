import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../stores/stores';
import { setInput, sendMessage, addMessage } from '../stores/chatSlice';
import { ArrowButton } from './ArrowButton';
import { v4 as uuidv4 } from 'uuid';

export function Chatbox() {
  const userInput = useSelector((state: RootState) => state.chat.input);
  const dispatch = useDispatch<AppDispatch>();

  const handleSend = () => {
    if (!userInput.trim()) return;

    dispatch(sendMessage(userInput));
  };

  return (
    <InputGroup size="md" maxWidth="700px">
      <Input
        pr="4.5rem" // Adjust padding-right to make space for the button
        placeholder="Ask Aaron anything"
        value={userInput}
        onChange={(e) => dispatch(setInput(e.target.value))}
        onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      }}
      />
      <InputRightElement width="4.5rem">
        <ArrowButton />
      </InputRightElement>
    </InputGroup>
  );
}