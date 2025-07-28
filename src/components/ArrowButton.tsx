import { Button, Icon } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../stores/stores';
import { sendMessage } from '../stores/chatSlice';

export function ArrowButton() {
    const dispatch = useDispatch<AppDispatch>();
  const userInput = useSelector((state: RootState) => state.chat.input);

  return (
    <Button
      colorScheme="gray"
      size="xs"
      borderRadius="full"
      rightIcon={<ArrowForwardIcon />}
      onClick={() => dispatch(sendMessage(userInput))}
      isDisabled={!userInput.trim()}
    />
  );
}