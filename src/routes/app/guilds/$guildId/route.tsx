import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { GuildInfo } from '@/components'
import { getGuild } from '@/lib/api'

export const Route = createFileRoute('/app/guilds/$guildId')({
    beforeLoad: async (context) => {
        const guild = await getGuild(context.params.guildId)
        if (!guild) throw redirect({ to: "/" })
        return { guild }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <div className="grow-1 flex flex-row">
        <GuildInfo />
        <Outlet />
    </div>
}
