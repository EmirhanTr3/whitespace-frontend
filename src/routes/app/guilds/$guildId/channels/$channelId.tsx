import { getChannel } from '@/lib/api'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ChannelInfo } from '@/components'

export const Route = createFileRoute('/app/guilds/$guildId/channels/$channelId')({
    beforeLoad: async (context) => {
        const channel = await getChannel(context.params.guildId, context.params.channelId)
        if (!channel) throw redirect({ to: "/app/guilds/" + context.params.guildId })
        return { channel }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <ChannelInfo />
}
