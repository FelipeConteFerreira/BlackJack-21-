# 🃏 Projeto Blackjack Next.js

Aplicação web de **Blackjack (21)** desenvolvida em **Next.js com TypeScript**, integrando a **Deck of Cards API**.  
O projeto inclui autenticação simples com `API_SECRET`, gerenciamento de sessão via `localStorage` e regras básicas do jogo (Hit, Stand, Ás valendo 1 ou 11, e lógica do dealer).


## 🚀 Tecnologias Utilizadas

- **Next.js 14**
- **TypeScript**
- **React**
- **Tailwind CSS**
- **Deck of Cards API** (https://deckofcardsapi.com/)
- **Node.js** (para a rota de login via API)


## ⚙️ Funcionalidades Principais

- 🔐 **Login seguro** com verificação de senha via `API_SECRET` no backend.
- 🧠 **Proteção de rotas** — somente acessa o jogo após autenticação.
- 🃏 **Integração com Deck of Cards API** para sortear baralhos reais.
- ➕ **Ações do jogador:** Pedir carta (Hit) e Parar (Stand).
- 🧮 **Cálculo automático de pontuação**, com tratamento de Ás (1 ou 11).
- 🤖 **Dealer automático**, que compra cartas até atingir 17 pontos.
- 🧼 **Opção de nova partida** (resetando baralho e pontuação).


## 🧩 Estrutura do Projeto

blackjack-nextjs/
│
├── app/
│ ├── api/
│ │ └── login/
│ │ └── route.ts # Rota de login (validação de senha)
│ ├── blackjack/
│ │ └── page.tsx # Página principal do jogo
│ ├── login/
│ │ └── page.tsx # Página de login
│ ├── globals.css # Estilos globais
│ └── layout.tsx # Layout base
│
├── .env.example # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md



## 🧰 Como Rodar o Projeto Localmente

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/seu-usuario/blackjack-nextjs.git
   cd blackjack-nextjs
Usar o comando:
npm install
npm run dev

Acessar no navegador
http://localhost:3000/login

Login
Usuário: qualquer nome
Senha: valor definido em API_SECRET

🎮 Como Jogar
Após o login, você será redirecionado para a tela do Blackjack.

Clique em "Iniciar Novo Jogo".

Use os botões:

🟢 "Pedir Carta" (Hit) — compra mais uma carta.

🔴 "Parar" (Stand) — finaliza sua jogada e deixa o dealer jogar.

O resultado (Vitória, Derrota ou Empate) aparece automaticamente.

Clique em "Novo Jogo" para recomeçar.

🧑‍💻 Desenvolvido por
Felipe Conte Ferreira
📅 Outubro de 2025
💡 Projeto acadêmico e experimental utilizando Next.js e integração com APIs públicas.

🧾 Licença
Este projeto é de uso livre para fins educacionais e demonstração.
