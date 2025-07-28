// src/index.js or src/main.jsx (for Create React App or Vite)
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme, Flex, Grid, GridItem, Box } from '@chakra-ui/react';
import { Chatbox } from './components/Chatbox';
import { ChatWindow } from './components/ChatWindow';
import { store } from './stores/stores';

const customTheme = extendTheme({
  colors: {
    brand: {
      100: '#f7fafc',
      // ...
      900: '#1a202c',
    },
  },
  // You can also customize other properties like fonts, breakpoints, etc.
  fonts: { 
    heading: 'Roboto, sans-serif',
    body: 'Arial, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={customTheme}> {/* Pass the custom theme here */}
        <Flex direction="column" height="100vh">
          <Box flex="1" overflowY="auto" px={4} py={2}>
            <Flex justify="center">
              <Box width="100%" maxW="600px">
                <ChatWindow />
              </Box>
            </Flex>
          </Box>

          {/* Fixed ChatBox at bottom */}
          <Box
            p={4}
            position="sticky"
            bottom="0"
            zIndex="10"
          >
            <Flex justify="center">
              <Box width="100%" maxW="600px">
                <Chatbox />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
);