import { User } from '@supabase/supabase-js';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../libs/supabase'; 

interface AuthContextProps {
  user: User | null;
  avatarUrl: string | null;
  setAuth: (authUser: User | null) => void;
  setAvatar: (avatarUrl: string | null) => void;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);


  const fetchUserAvatar = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar avatar:', error);
    } else {
      setAvatarUrl(data?.avatar_url || null);
    }
  };


  useEffect(() => {
    if (user?.id) {
      fetchUserAvatar(user.id);
    }
  }, [user]);

  
  const setAuth = (authUser: User | null) => {
    setUser(authUser);
  };


  const setAvatar = (avatarUrl: string | null) => {
    setAvatarUrl(avatarUrl);
  };

  return (
    <AuthContext.Provider value={{ user, avatarUrl, setAuth, setAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
