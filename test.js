import { io } from "socket.io-client";

const socket = io("ws://localhost:3002", {
    extraHeaders: {
        // 'Cookie': "better-auth.session_token=JBp1c3HulOrIklg5gxgIqGPKWxBDNm66.oGiBm41zopdkL5xiLDcUIp3BNjspYoh1nMsiUi6tWT4%3D"
    }
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
