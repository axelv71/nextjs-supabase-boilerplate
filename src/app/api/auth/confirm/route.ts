import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import {notFound, redirect} from 'next/navigation'
import {createClient} from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    console.log('GET /api/auth/confirm')
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'

    if (token_hash && type) {
        const supabase = createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            // redirect user to specified redirect URL or root of app
            redirect(next)
        }

        console.error('Error verifying OTP:', error)
    }

    // redirect the user to an error page with some instructions
    notFound()
}