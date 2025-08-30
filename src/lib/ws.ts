import { io } from "socket.io-client";

export const socket = io("ws://localhost:3002", {
    withCredentials: true
})

socket.on("connect", () => {
    console.log("connected")
})

socket.on("connect-fail", () => {
    console.log("connect-fail")
})

socket.on("disconnect", () => {
    console.log("disconnected")
})