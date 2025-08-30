import { useRouteContext } from "@tanstack/react-router"
import { createRef, FormEvent, useEffect, useRef, useState } from "react"
import { APIValidationError, createMessage, getMessages, Message } from "@/lib/api"
import { socket } from "@/lib/ws"

export default function ChannelInfo() {
    const { channel } = useRouteContext({ from: "/app/guilds/$guildId/channels/$channelId" })
    const input = createRef<HTMLInputElement>()
    const [ messages, setMessages ] = useState<Message[]>([])
    const messagesRef = useRef<HTMLDivElement>(null)

    async function loadMessages() {
        const messages = await getMessages(channel.guildId, channel.id);
        if (!messages) return;
        console.log("Loaded " + messages.length + " messages.")
        setMessages(messages)
        setTimeout(() => {
            messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight - messagesRef.current!.clientHeight
        }, 10);
    }

    useEffect(() => {
        socket.removeAllListeners("messageCreate")
        loadMessages()
    }, [channel.id])

    socket.on("messageCreate", (message: Message) => {
        if (message.channelId !== channel.id) return;
        socket.removeAllListeners("messageCreate")
        console.log(`Received messageCreate from ${message.author.user.name}: ${message.content}`)
        setMessages([...messages, message])
        setTimeout(() => {
            messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight - messagesRef.current!.clientHeight
        }, 10);
    })

    async function sendMessage(event: FormEvent) {
        event.preventDefault()
        const message = input.current!.value
        if (!message || message.replaceAll(" ", "").length == 0) return;
        input.current!.value = ""

        const newMessage = await createMessage(channel.guildId, channel.id, { content: message })

        if (newMessage instanceof APIValidationError) {
            console.error("Failed to send message:", newMessage.errors)
            return;
        }

        console.log("Sent message " + message + " in channel " + channel.id)
    }

    return <div className="flex flex-col grow-[1]">
        <div className="h-12 pl-4 pr-3 py-3 border-b border-neutral-900 flex flex-row items-center gap-2">
            <img src="/assets/text.png" className="w-6 h-6"/>
            <p className="text-stone-200">{channel.name}</p>
        </div>
        <div ref={messagesRef} className="flex flex-col py-3 grow-[1] gap-2 overflow-y-auto">
            {messages.map(message =>
                <div key={message.id} className="flex flex-row gap-2 items-center px-3 py-0.5 hover:bg-white/5 hover:rounded-[4px]">
                    {message.author.user.avatar ?
                        <img className="w-12 h-12 rounded-[50%]" src={message.author.user.avatar} /> :
                        <img className="w-12 h-12 rounded-[50%]" src="/favicon.ico" />
                    }
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-2 items-center">
                            <p className="text-stone-300">{message.author.user.displayname}</p>
                            <p className="text-neutral-500 text-xs">{message.createdAt.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-neutral-400">{message.content}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className="p-3">
            <form onSubmit={sendMessage}>
                <input ref={input} className="py-2.5 px-3 rounded-lg w-full bg-[#212121] outline-0 text-neutral-400" type="text" placeholder="Send a message to current channel"/>
            </form>
        </div>
    </div>
}