import { ZodError } from "zod";

const BASE_URL = "http://localhost:3001/api"

function req(input: RequestInfo | URL, init?: RequestInit) {
    init = {
        ...init,
        credentials: "include"
    }
    return fetch(BASE_URL + input, init);
}

function get(input: RequestInfo | URL) {
    return req(input)
}

function post(input: RequestInfo | URL, body: any) {
    return req(input, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function getGuild(id: string): Promise<Guild | null> {
    const request = await get("/guilds/" + id);
    if (!request.ok) return null;

    return await request.json();
}

export async function getGuilds(): Promise<Guild[] | null> {
    const request = await get("/guilds");
    if (!request.ok) return null;

    return await request.json();
}

export async function createGuild(data: { name: string }): Promise<Guild | APIValidationError> {
    const request = await post("/guilds", data);
    if (!request.ok) return new APIValidationError(await request.json());

    return await request.json();
}

export async function getChannel(guildId: string, channelId: string): Promise<Channel | null> {
    const request = await get("/guilds/" + guildId + "/channels/" + channelId);
    if (!request.ok) return null;

    return await request.json();
}

export async function createChannel(guildId: string, data: { name: string }): Promise<Channel | APIValidationError> {
    const request = await post("/guilds/" + guildId + "/channels", data);
    if (!request.ok) return new APIValidationError(await request.json());

    return await request.json();
}

export async function getMessages(guildId: string, channelId: string): Promise<Message[] | null> {
    const request = await get("/guilds/" + guildId + "/channels/" + channelId + "/messages");
    if (!request.ok) return null;

    return await request.json();
}

export async function createMessage(guildId: string, channelId: string, data: { content: string }): Promise<Message | APIValidationError> {
    const request = await post("/guilds/" + guildId + "/channels/" + channelId + "/messages", data);
    if (!request.ok) return new APIValidationError(await request.json());

    return await request.json();
}

export class APIValidationError {
    public errors: { [key: string]: string } = {};

    constructor(data: APIValidationErrorData | ZodError) {
        if (data instanceof ZodError)
            data = JSON.parse(data.message) as APIValidationErrorData;
        for (const entry of data) {
            this.errors[entry.path] = entry.message;
        }
    }
}

export type APIValidationErrorData = { path: string, message: string }[];

export type Member = {
    id: string;
    userId: string;
    user: any;
    guildId: string;
    guild: Guild;
    messages: Message[];
}

export type Guild = {
    id: string;
    name: string;
    icon?: string;
    channels: Channel[];
    members: Member[];
    ownerId: string;
    owner: any;
    createdAt: string;
}

export type Channel = {
    id: string;
    name: string;
    guildId: string;
    guild: Guild;
    messages: Message[];
    createdAt: string;
}

export type Message = {
    id: string;
    channelId: string;
    channel: Channel;
    authorId: string;
    author: Member;
    content: string;
    createdAt: string;
}