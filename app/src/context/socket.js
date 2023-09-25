import { io } from "socket.io-client";
import { createContext } from "react";

export const socket = io({ path: "/api/v1/socketio/" });
export const SocketContext = createContext();
