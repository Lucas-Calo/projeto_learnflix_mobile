import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { auth, db } from '../config/firebase';

// Esta função cria a conta (Auth) E salva os dados (Firestore)...
export const registerUser = async (userData) => {
  try {
    // 1. Cria a conta de autenticação (E-mail/Senha)
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const uid = userCredential.user.uid;

    // Guarda os dados do perfil na base de dados
    // Usei o UID como chave do documento para ser fácil de relacionar
    await setDoc(doc(db, "usuarios", uid), {
      name: userData.name,
      email: userData.email,
      profile: userData.profile || 'Aluno'
    });

    return { success: true };
  } catch (error) {
    console.error("Erro no cadastro:", error);
    let message = 'Erro ao cadastrar.';
    if (error.code === 'auth/email-already-in-use') message = 'E-mail já em uso.';
    if (error.code === 'auth/weak-password') message = 'Senha muito fraca (mínimo 6 caracteres).';
    return { success: false, message };
  }
};

// Busca todos os utilizadores do Firestore (para o Gestor)
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Erro ao buscar utilizadores:", error);
    return [];
  }
};


export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, "usuarios", userId));
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return { success: false, message: error.message };
  }
};