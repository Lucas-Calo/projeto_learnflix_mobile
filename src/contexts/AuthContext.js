import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Se o utilizador fez login, precisamos de ir buscar os dados extras (perfil, nome)
        // que estão guardados na base de dados (Firestore)
        try {
          const docRef = doc(db, "usuarios", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...docSnap.data()
            });
          } else {
            // Fallback se não tiver dados no banco (ex: criado manualmente só no Auth)
            setUser({ 
              uid: firebaseUser.uid, 
              email: firebaseUser.email, 
              name: 'Utilizador', 
              profile: 'Aluno' 
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do perfil:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let message = 'Erro ao fazer login.';
      if (error.code === 'auth/invalid-email') message = 'E-mail inválido.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') message = 'E-mail ou senha incorretos.';
      if (error.code === 'auth/wrong-password') message = 'Senha incorreta.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);