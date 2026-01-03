import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import { set } from 'zod'

const ProtectedRoute = () => {
    const { accessToken , user, loading, fetchMe, refresh } = useAuthStore()
    const [starting, setStarting] = useState(true);

    const init = async () => {
        if (!accessToken) {
            await refresh()
        }

        if (accessToken && !user) {
            await fetchMe()
        }

        setStarting(false);
    }

    useEffect(() => {
        init()
    }, [])

    if (!accessToken) {
        return <Navigate to="/sign-in" replace/>
    }
    if (starting || loading) {
        return <div className='flex h-screen items-center justify-center'>Loading...</div>
    }

    return <Outlet/>
}

export default ProtectedRoute