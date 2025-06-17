import React, { useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setUser, setLoading } from "../../slices/authSlice";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.auth.loading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
    });

    return unsubscribe;
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return <>{children}</>;
};

export default AuthProvider;