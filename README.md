O LearnFlix Mobile é uma aplicação nativa desenvolvida com React Native (Expo) para gestão de atividades escolares. Este projeto representa a migração completa da versão web para o ambiente mobile, integrando funcionalidades nativas e serviços na nuvem.

📱 Funcionalidades Principais:

📌 Autenticação Real: Login seguro com E-mail e Senha via Firebase Authentication.

📌 Perfis de Acesso:

⚪️ Aluno: Visualiza atividades, entrega trabalhos, tira fotos do caderno e anexa PDFs.

🔵 Professor: Cria atividades, visualiza lista de alunos, avalia entregas e dá feedback.

🟢 Gestor: Painel administrativo com estatísticas em tempo real e cadastro de novos usuários.

Recursos Nativos:

📌 Câmera: Captura de fotos para anexar à entrega.

📌 Documentos: Seleção de arquivos PDF do dispositivo.

📌 Gestos: Navegação intuitiva com "swipe-to-back".

📌 Persistência na Nuvem: Todos os dados (usuários, atividades, entregas) são sincronizados em tempo real com o Cloud Firestore.

📌 UX Aprimorada: Tratamento de teclado (KeyboardAvoidingView), sombras nativas e animações de transição.


🚀 Como Rodar o Projeto:

Pré-requisitos

Certifique-se de ter instalado:

📌 Node.js (v18 ou superior)

📌 Git

📌 Expo Go no seu celular (Android ou iOS) OU um Simulador (Xcode/Android Studio).

Passo a Passo:

1. Clone o repositório: Abra o seu terminal e execute:

git clone [https://github.com/Lucas-Calo/projeto_learnflix_mobile.git](https://github.com/Lucas-Calo/projeto_learnflix_mobile.git)


2. Acesse a pasta do projeto:

cd projeto_learnflix_mobile


3. Instale as dependências:

npm install

(Caso encontre erros de dependência, tente npx expo install).

4. Configuração do Firebase:

O projeto já inclui o arquivo src/config/firebase.js com as credenciais de teste configuradas. Não é necessário realizar nenhuma configuração adicional para testes básicos.

Nota: Para um ambiente de produção real, recomenda-se criar o seu próprio projeto no Firebase e substituir as chaves.

5. Inicie o servidor de desenvolvimento:

npx expo start --clear


6. Abra o Aplicativo:

No Celular: Escaneie o QR Code com o app Expo Go (Android) ou com a Câmera (iOS).
No Simulador: Pressione i (para iOS) ou a (para Android) no terminal.


🔐 Credenciais de Teste

Para testar os diferentes perfis da aplicação:

Perfil | E-mail | Senha

Gestor | gestor@learnflix.com | 123456

Professor | professor@learnflix.com | 123456

Aluno 1 | aluno@learnflix.com | 123456

Aluno 2 | satoshinakamoto@learnflix.com |123456

🛠️ Tecnologias Utilizadas

📌 React Native (Expo SDK 52)

📌 React Navigation (Native Stack)

📌 Firebase (Auth & Firestore)

📌 Expo Camera & Document Picker

📌 AsyncStorage (Persistência local de sessão)

👤 Autor

Desenvolvido por Lucas Progetti Coelho Caló como parte do Projeto de Bloco.