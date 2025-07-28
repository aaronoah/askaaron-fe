import { Textarea } from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';

export function MultilineInput() {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = textarea.scrollHeight + 'px'; // Set to content height
    }
  };

  useEffect(() => {
    autoResize(); // Resize on initial load or content change
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Optional: prevent submitting form on Enter (if inside a form)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // handle submit or ignore
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type here... (Shift+Enter for new line)"
      resize="none"
      borderRadius="md"
      minH="20px"
      _focus={{ borderColor: 'blue.500', boxShadow: 'sm' }}
    />
  );
}
