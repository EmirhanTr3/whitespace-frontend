import { authClient } from '@/lib/auth-client';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { GuildList } from '@/components';
import { socket } from '@/lib/ws';
import { useEffect } from 'react';

export const Route = createFileRoute('/app')({
    beforeLoad: async () => {
        const session = await authClient.getSession()
        if (!session.data?.user) throw redirect({ to: "/login" })
        return { user: session.data.user }
    },
    component: Home
})

function Home() {
    const { user } = Route.useRouteContext()

    useEffect(() => {
        socket.connect()
    }, [])

    return <>
        <div className="flex flex-row grow-1">
            <GuildList />
            <Outlet />
        </div>
        <div className="h-14 w-[312px] bg-neutral-900 border-t border-r border-neutral-950 absolute bottom-0">
            <div className="flex flex-row align-center p-2">
                {user.avatar ?
                    <img className="w-10 h-10 rounded-[50%]" src={user.avatar} /> :
                    <img className="w-10 h-10 rounded-[50%]" src="/favicon.ico" />
                }
                <div className="flex flex-col pl-2 justify-center">
                    <p className="text-white text-[13px] h-4">{user.displayname}</p>
                    <p className="text-neutral-400 text-[11px] h-4">{user.name}</p>
                </div>
            </div>
        </div>
    </>
}