'use client';

import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {AlertCircle, LoaderCircle} from "lucide-react";
import {useFormStatus, useFormState} from 'react-dom';
import React from "react";
import {signUp} from "@/actions/auth";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RegisterForm = ({
    className,
    ...props
}: RegisterFormProps) => {
    const [state, action] = useFormState(signUp, {
        errors: {}
    })
    const { pending } = useFormStatus();

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form action={action}>
                <div className="grid gap-4">
                    <div className="grid gap-1">
                        <Label htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={pending}
                        />
                        {state.errors.email && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {state.errors.email}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
                            disabled={pending}
                        />
                        {state.errors.password && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {state.errors.password}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    {state.errors._form && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {state.errors._form}
                            </AlertDescription>
                        </Alert>
                    )}
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {pending && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
            )}
            Sign Up with Email
        </Button>
    )
}