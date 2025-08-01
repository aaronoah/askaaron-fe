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
  thinking: boolean
}

const initialState: ChatState = {
  input: '',
  messages: [],
  thinking: false,
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

    const baseUrl = import.meta.env.VITE_BACKEND_CORS_ORIGINS;
    const sessionId = await fetch(`${baseUrl}/prompt`, {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: { "Content-Type": "application/json" }
    }).then(res => res.json()).then(data => data.session_id);

    // when conversation service is not up we need to wait and set thinking state here
    dispatch(setThinking(true));
    await conversationTask(baseUrl, sessionId, botMsgId, dispatch);
  }
);

const conversationTask = async (baseUrl: string, sessionId: string, botMsgId: string, dispatch: any) => {
  const eventSource = new EventSource(`${baseUrl}/conversation?session_id=${sessionId}`);

    eventSource.onmessage = (event) => {
      dispatch(setThinking(false));
      dispatch(appendToMessageWithId({ id: botMsgId, chunk: event.data }));
    };

    eventSource.addEventListener("end", () => {
      eventSource.close();
    });

    eventSource.onerror = (err) => {
      console.error(err);
      eventSource.close();
      dispatch(setThinking(false));
    };
};

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
    setThinking(state, action: PayloadAction<boolean>) {
      state.thinking = action.payload;
    },
  },
});

export const {
  setInput,
  addMessage,
  appendToMessageWithId,
  clearMessages,
  setThinking
} = chatSlice.actions;

export default chatSlice.reducer;
