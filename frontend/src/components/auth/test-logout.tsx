import React from 'react'
import { Button } from '../ui/button'
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';

const TestLogout = () => {
    const { signOut } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/sign-in");
    };

    return (
        <div>
            <Button onClick={handleLogout} className='bg-red-500 text-white'>Đăng xuất</Button>
        </div>
    )
}

export default TestLogout