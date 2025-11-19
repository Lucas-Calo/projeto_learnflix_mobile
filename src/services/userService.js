import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_STORAGE_KEY = 'usuarios';

const usuariosPadrao = [
  { id: 1, email: 'aluno@learnflix.com', password: '123456', profile: 'Aluno', name: 'Lucas Caló' },
  { id: 2, email: 'professor@learnflix.com', password: '123456', profile: 'Professor', name: 'Prof. Thiago Vieira de Aguiar' },
  { id: 3, email: 'gestor@learnflix.com', password: '123456', profile: 'Gestor', name: 'Gestor Admin' },
  { id: 4, email: 'aluno2@learnflix.com', password: '123456', profile: 'Aluno', name: 'Cristiano Ronaldo' },
];

const carregarUsuarios = async () => {
  try {
    const dadosSalvos = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (dadosSalvos) return JSON.parse(dadosSalvos);
    return usuariosPadrao;
  } catch (e) {
    return usuariosPadrao;
  }
};

const salvarUsuarios = async (listaDeUsuarios) => {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(listaDeUsuarios));
  } catch (e) {
    console.error("Erro ao guardar utilizadores:", e);
  }
};

export const login = async (email, password) => {
  const users = await carregarUsuarios();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) return { success: true, user: { id: user.id, email: user.email, profile: user.profile, name: user.name } };
  return { success: false, message: 'Credenciais inválidas' };
};

export const getAllUsers = async () => {
  const users = await carregarUsuarios();
  return [...users];
};

export const registerUser = async (userData) => {
  const users = await carregarUsuarios();
  if (users.some(u => u.email === userData.email)) {
    return { success: false, message: 'E-mail já registado.' };
  }
  const newUser = { ...userData, id: Date.now() };
  users.push(newUser);
  await salvarUsuarios(users);
  return { success: true, users: [...users] };
};