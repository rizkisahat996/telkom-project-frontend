'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import LogoutIcon from '@mui/icons-material/Logout'

const LoginLinks = () => {
    const { user } = useAuth({ middleware: 'guest' })
    const { logout } = useAuth()

    return (
        <div className="flex gap-8 p-6 justify-center items-center">
            {user ? (
                <>
                    <Link
                        href="/dashboard"
                        className="text-sm text-white border bg-semipurple border-beige rounded-lg p-3 no-underline hover:bg-beige h-12 w-24 text-center align-middle">
                        Dashboard
                    </Link>

                    <Button
                        title="Log Out"
                        onClick={logout}
                        className="justify-center !text-sm !text-white !border !bg-semipurple !border-beige !rounded-lg !p-3 no-underline hover:!bg-beige h-12 w-24 !text-center !align-middle !normal-case">
                        <LogoutIcon />
                    </Button>
                </>
            ) : (
                <>
                    <Link
                        href="/login"
                        className="text-sm text-white border bg-semipurple border-beige rounded-lg p-3 no-underline hover:bg-beige h-12 w-24 text-center align-middle">
                        Login
                    </Link>

                    <Link
                        href="/register"
                        className="text-sm text-white border bg-semipurple border-beige rounded-lg p-3 no-underline hover:bg-beige h-12 w-24 text-center align-middle">
                        Register
                    </Link>
                </>
            )}
        </div>
    )
}

export default LoginLinks
