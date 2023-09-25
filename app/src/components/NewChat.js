import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { selectUser } from "../features/session/sessionSlice";
import { postData } from "../utils/utils";
import { CryptoState } from "../CryptoContext";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { SocketContext } from "../context/socket";
import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  Typography,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
} from "@material-ui/core";

function Chat() {
  const socket = useContext(SocketContext);
  const { user } = CryptoState();
  const [handle, setHandle] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (handle) {
      clearTimeout(handle);
    }
    const handle_ = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView(true);
    }, 200);
    setHandle(handle_);
  };

  //TODO: FIx that
  async function submitMessage() {
    try {
      console.log(message);
      const res = await postData("/api/v1/chat/new_message", {
        signature: user.email,
        message,
      });
      if (res.error) {
        console.log(res);
      }
      setMessage("");
    } catch (err) {
      return Promise.reject(err);
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on("newmessage", (message) => {
        setMessages((messages_) => [...messages_, message]);
      });
    }
  }, [socket]);

  useEffect(() => {
    fetch("/api/v1/chat/get_messages")
      .then((response) => response.json())
      .then((data) => {
        try {
          setMessages(data.reverse());
        } catch (err) {}
      });
  }, []);

  useEffect(() => {
    {
      /*scrollToBottom();*/
    }
  }, [messages]);
  return (
    <Container style={{ textAlign: "center" }}>
      <Typography variant="h4" style={{ margin: 18, fontFamily: "Montserrat" }}>
        Alpha Chat
      </Typography>
      <Box className="App-chat">
        <Box className="App-chat-wrapper">
          <Box className="App-chat-window">
            <Box className="App-chat-messages">
              {messages.map((message, i) => (
                <Box key={i}>
                  <Box>
                    {new Date(message.createdAt)
                      .getHours()
                      .toString()
                      .padStart(2, "0")}
                    :
                    {new Date(message.createdAt)
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}
                  </Box>
                  <Box>{message.user}:</Box>
                  <Box>{message.body}</Box>
                </Box>
              ))}
              <div ref={messagesEndRef}></div>
            </Box>
          </Box>
          <Box className="App-chat-ui">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitMessage();
              }}
            >
              <TextField
                id="outlined-basic"
                color="secondary"
                variant="outlined"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  user
                    ? "Message or /help..."
                    : "You must be logged in to chat."
                }
                disabled={!user}
                fullWidth
              />
            </form>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Chat;
