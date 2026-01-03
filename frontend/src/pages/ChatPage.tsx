import TestLogout from '@/components/auth/test-logout'
import { Button } from '@/components/ui/button';
import api from '@/services/axios';
import { useAuthStore } from '@/stores/useAuthStore'
import { use } from 'react'
import { toast } from 'sonner';


const ChatPage = () => {
  const user = useAuthStore(state => state.user);

  const handleClick = async () => {
    try {
      await api.get('/user/test', { withCredentials: true });
      toast.success("API request thành công!");
    } catch (error) {
      console.error(error);
      toast.error("API request thất bại!");
    }
  }

  return (
    <div>
      <h1>ChatPage</h1>
      <h2>{user?.displayName}</h2>
      <TestLogout />

      <Button onClick={handleClick}>Test</Button>
    </div>
  )
}

export default ChatPage