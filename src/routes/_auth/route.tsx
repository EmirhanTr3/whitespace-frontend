import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_auth')({
    beforeLoad: async () => {
        const session = await authClient.getSession()
        if (session.data?.user) throw redirect({ to: "/" })
    }
})
