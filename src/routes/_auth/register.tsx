import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useRef, useState, FormEvent } from "react";
import { FormBackground, FormBox, FormHeader, Form, FormFields, FormField, FormButton } from "@/components";
import { authClient } from "@/lib/auth-client";
import { RegisterFormSchema } from "@/lib/definitions";
import { APIValidationError } from "@/lib/api";

export const Route = createFileRoute('/_auth/register')({
  component: RegisterRoute,
})

export default function RegisterRoute() {
    const nameRef = useRef<HTMLInputElement>(null)
    const displaynameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    
    const [state, setState] = useState<APIValidationError>()
    const [failed, setFailed] = useState<Boolean>(false)
    
    async function onSubmit(event: FormEvent) {
        event.preventDefault()

        const validatedFields = await RegisterFormSchema.safeParseAsync({
            name: nameRef.current!.value,
            displayname: displaynameRef.current!.value,
            email: emailRef.current!.value,
            password: passwordRef.current!.value
        })
        if (!validatedFields.success) {
            setFailed(false)
            return setState(new APIValidationError(validatedFields.error))
        } else if (state) {
            setState(undefined)
        }

        const result = await authClient.signUp.email({
            name: nameRef.current!.value,
            displayname: displaynameRef.current!.value,
            email: emailRef.current!.value,
            password: passwordRef.current!.value,
            badges: []
        })

        if (!result.error) {
            router.navigate({ to: "/" })
        } else {
            console.log(result)
            setFailed(true)
        }
    }

    return <>
        <FormBackground>
            <FormBox>
                <FormHeader />
                {failed && <p className="text-red-500 list-disc text-sm">A user with provided email or username already exists.</p>}
                <Form onSubmit={onSubmit}>
                    <FormFields>
                        <FormField ref={nameRef} name="username" text="USERNAME" error={state?.errors?.name}></FormField>
                        <FormField ref={displaynameRef} name="displayname" text="DISPLAY NAME" error={state?.errors?.displayname}></FormField>
                        <FormField ref={emailRef} name="email" text="EMAIL" error={state?.errors?.email}></FormField>
                        <FormField ref={passwordRef} name="password" type="password" text="PASSWORD" error={state?.errors?.password}></FormField>
                    </FormFields>
                    <FormButton text="Register" />
                </Form>
                <p className="text-stone-200 text-sm">Already have an account? <Link className="text-indigo-400 hover:underline" to="/login">Login</Link></p>
            </FormBox>
        </FormBackground>
    </>
}