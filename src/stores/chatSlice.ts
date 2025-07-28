import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatState {
  input: string;           // input prompt text
  messages: Message[];     // chat history
}

const initialState: ChatState = {
  input: '',
  messages: [],
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (prompt: string, { dispatch }) => {
    const userMsgId = uuid();
    const botMsgId = uuid();

    // Add user's message
    dispatch(addMessage({
      id: userMsgId,
      sender: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    }));

    // Add empty assistant message
    dispatch(addMessage({
      id: botMsgId,
      sender: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    }));

    dispatch(setInput(""));

    const sessionId = await fetch("http://localhost:8000/prompt", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: { "Content-Type": "application/json" }
    }).then(res => res.json()).then(data => data.session_id);

    const eventSource = new EventSource(`http://localhost:8000/conversation?session_id=${sessionId}`);

    eventSource.onmessage = (event) => {
      dispatch(appendToMessageWithId({ id: botMsgId, chunk: event.data }));
    };

    eventSource.addEventListener("end", () => {
      eventSource.close();
    });
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setInput: (state, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    appendToMessageWithId: (
      state,
      action: PayloadAction<{ id: string; chunk: string }>
    ) => {
      const message = state.messages.find(m => m.id === action.payload.id);
      if (message) {
        message.content += action.payload.chunk + ' ';
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setInput,
  addMessage,
  appendToMessageWithId,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
