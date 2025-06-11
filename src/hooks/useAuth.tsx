// hooks/useAuth.tsx

import { useAppSelector, useAppDispatch } from '../hooks';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { clearUser } from '../slices/authSlice';
import { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Drop-in replacement for your existing useAuth hook
export const useAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const { currentUser, loading } = useAppSelector(state => state.auth);

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    currentUser,
    loading,
    logout,
  };
};

export default useAuth;