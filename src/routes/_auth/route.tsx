import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_auth')({
    beforeLoad: async () => {
        const session = await authClient.getSession()
        console.log(session.data?.user)
        if (session.data?.user) throw redirect({ to: "/" })
    }
})
