import { createContext } from "react";
import { User } from "firebase/auth"; 

export interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
