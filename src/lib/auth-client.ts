import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
    baseURL: "http://localhost:3001",
    plugins: [inferAdditionalFields({
        user: {
            displayname: {
                type: "string",
                required: true
            },
            rank: {
                type: "string",
                required: true,
                defaultValue: "USER",
            },
            badges: {
                type: "string[]",
                required: true,
                defaultValue: []
            },
            avatar: {
                type: "string",
                required: false
            }
        }
    })]
})