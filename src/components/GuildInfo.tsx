import { useRouteContext, Link, useRouter } from "@tanstack/react-router"
import { useState, createRef } from "react"
import { CreateChannelFormSchema } from "@/lib/definitions"
import { Modal, ModalInputField } from "./Modal"
import { APIValidationError, createChannel } from "@/lib/api"

export default function GuildList() {
    const { guild } = useRouteContext({ from: "/app/guilds/$guildId" })
    const [ isOpen, setIsOpen ] = useState(false)
    const [ createDisabled, setCreateDisabled ] = useState(false)
    const nameInput = createRef<HTMLInputElement>()
    const [ state, setState ] = useState<APIValidationError>()
    const router = useRouter()

    async function createChannelCallback() {
        if (createDisabled) return;
        
        const validatedFields = CreateChannelFormSchema.safeParse({
            name: nameInput.current!.value
        })

        if (!validatedFields.success) {
            return setState(new APIValidationError(validatedFields.error))
        }

        setCreateDisabled(true)

        const channel = await createChannel(guild.id, { name: nameInput.current!.value })

        if (channel instanceof APIValidationError) {
            setCreateDisabled(false)
            return setState(channel)
        }
        
        setIsOpen(false)
        setCreateDisabled(false)

        console.log("Created channel named " + channel.name + " with id " + channel.id)
        router.invalidate()
    }

    return <div className="basis-60 shrink-0 bg-[#212121] flex flex-col">
        <div className="h-12 pl-4 pr-3 py-3 border-b border-neutral-900 flex flex-row justify-between items-center">
            <p className="text-stone-200">{guild.name}</p>
            <div onClick={() => setIsOpen(true)} className="group w-5 h-5 flex items-center justify-center cursor-pointer">
                <svg className="group-hover:w-5 group-hover:h-5 transition-all ease-in-out duration-50" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>
            </div>
            {isOpen &&
                <Modal title="Create a Channel" confirmLabel="Create" confirmCallback={() => createChannelCallback()} cancelCallback={() => {setIsOpen(false); setState(undefined)}}>
                    <ModalInputField ref={nameInput} name="Channel Name" error={state?.errors?.name} />
                </Modal>
            }
        </div>
        <div className="flex flex-col p-2 overflow-y-auto h-full">
            {guild.channels && guild.channels.map(channel =>
                <Link key={channel.id} to={"/app/guilds/" + guild.id + "/channels/" + channel.id}>
                    <div className="group px-2 py-1 h-8 items-center flex flex-row gap-1 hover:bg-white/5 hover:rounded-[5px] cursor-pointer">
                        <img src="/assets/text.png" className="w-6 h-6"/>
                        <p className="text-gray-400 group-hover:text-gray-300">{channel.name}</p>
                    </div>
                </Link>
            )}
        </div>
    </div>
}