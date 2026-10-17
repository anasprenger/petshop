# Pet Shop - Gerenciamento de Animais e Serviços

Aplicativo React Native com CRUD completo para gerenciamento de animais de estimação e serviços realizados em uma pet shop.

## 📋 Sobre o Projeto

**Tema**: Pet Shop - Gerenciamento de Animais e Serviços
**Tipo**: Aplicativo React Native com CRUD (Create, Read, Update, Delete)
**Tecnologias**: React Native, Node.js, Express, MySQL

## ✨ Funcionalidades

- ✅ **Create**: Cadastrar novos animais e serviços
- ✅ **Read**: Visualizar lista de animais e serviços com filtros
- ✅ **Update**: Editar informações existentes
- ✅ **Delete**: Excluir registros com confirmação

## 🛠️ Tecnologias Utilizadas

### Frontend
- React Native (Expo)
- JavaScript ES6+
- StyleSheet (React Native)

### Backend
- Node.js
- Express
- MySQL
- Fetch API

## 📁 Estrutura do Projeto

```
petshop/
├── App.js                 # Componente principal (orquestração)
├── backend/               # API Node.js + Express
│   ├── server.js          # Servidor principal
│   ├── db.js              # Configuração do MySQL
│   └── routes/            # Rotas CRUD
├── hooks/                 # Hooks customizados
│   ├── useDataFetching.js # Gerenciamento de dados
│   └── useFormModal.js    # Gerenciamento de modal
├── components/            # Componentes reutilizáveis
│   ├── Cards/             # AnimalCard, ServicoCard
│   └── Forms/             # FormModal
├── utils/                 # Funções utilitárias
│   ├── api.js             # Requisições HTTP
│   ├── normalizers.js     # Normalização de dados
│   └── dateFormatter.js   # Formatação de datas
├── constants/             # Constantes da aplicação
│   └── selectOptions.js   # Opções de select
└── styles/                # Estilos
    └── colors.js          # Cores centralizadas
```

## 🚀 Como Executar

### 1. Setup do Banco de Dados

```bash
# Executar o script SQL para criar banco e tabelas
mysql -u root -p < setup-database.sql
```

### 2. Instalar Dependências

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Configurar Backend

Editar `backend/db.js` com suas credenciais MySQL:
```javascript
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'petshop_db'
});
```

### 4. Iniciar o Backend

```bash
cd backend
node server.js
```

O servidor rodará em `http://localhost:3000`

### 5. Iniciar o Frontend

```bash
npm start
```

Abrir em modo web: `w`
Ou escanear QR code no Expo Go (Android/iOS)

## 📊 Estrutura do Banco de Dados

### Tabela: animais
- `id` (INT, PK, Auto-increment)
- `nome` (VARCHAR)
- `especie` (VARCHAR)
- `raca` (VARCHAR)
- `idade` (INT)
- `tutor` (VARCHAR)
- `telefone` (VARCHAR)

### Tabela: servicos
- `id` (INT, PK, Auto-increment)
- `animal_id` (INT, FK)
- `tipo` (VARCHAR)
- `data` (DATE)
- `valor` (DECIMAL)
- `status` (VARCHAR)
- `observacoes` (TEXT)

## 🔄 Fluxo de Dados

```
Frontend (React Native)
    ↓
Requisição HTTP (Fetch)
    ↓
Backend (Express)
    ↓
MySQL (Persistência)
    ↓
Resposta JSON
    ↓
Frontend (Atualiza UI)
```

## 📝 Operações CRUD

### Create
1. Clique em "+ Novo"
2. Preencha os campos obrigatórios
3. Clique em "Cadastrar"
4. Dados são enviados via POST para a API

### Read
1. Os dados são carregados automaticamente ao abrir o app
2. Visualize a lista de animais ou serviços
3. Use as abas para alternar entre seções

### Update
1. Clique em "Editar" no item desejado
2. Modifique os campos
3. Clique em "Salvar alterações"
4. API atualiza o registro via PUT

### Delete
1. Clique em "Excluir"
2. Confirme a exclusão
3. Registro é removido via DELETE

## 🎨 Design e UX

- **Cores**: Paleta verde e bege para ambiente acolhedor
- **Typography**: Hierarquia clara de títulos e textos
- **Layout**: Responsivo e intuitivo
- **Feedback**: Mensagens de sucesso/erro ao usuário

## 🔧 Validações Implementadas

- ✅ Campos obrigatórios (nome, especie, tutor, etc)
- ✅ Formato de data (DD/MM/AAAA ou AAAA-MM-DD)
- ✅ Valor numérico válido
- ✅ Idade como número inteiro positivo
- ✅ Confirmação antes de deletar

## 📈 Melhorias de Código

- **Refatoração**: 1050 → 320 linhas (App.js)
- **Componentes**: Cards e Formulários isolados
- **Hooks**: useDataFetching e useFormModal
- **Utils**: Funções puras e reutilizáveis
- **Constantes**: Centralizadas em um arquivo
- **Cores**: Tema centralizado

## 🎓 Conceitos Demonstrados

- React Hooks (useState, useEffect)
- Component Composition
- Custom Hooks
- API REST
- HTTP Methods (GET, POST, PUT, DELETE)
- Validação de formulários
- Gerenciamento de estado
- Separação de responsabilidades
- Clean Code

## 👨‍💻 Autor

Ana Sprenger

## 📄 Licença

Projeto desenvolvido para fins educacionais.
