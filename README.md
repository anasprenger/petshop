# PetCare — Gerenciamento de Pet Shop

Aplicativo para cadastrar animais, registrar os serviços do pet shop e acompanhar o histórico de cada pet, com CRUD completo de **animais** e **serviços**.

**Tecnologias:** React Native (Expo) + React Navigation · Node.js + Express · MySQL · API REST com `fetch`

## Estrutura

```
petshop/
├── mobile/      App React Native (Expo): telas, componentes, navegação e cliente da API
├── backend/     API REST (Node.js + Express + mysql2)
├── database/    schema.sql (banco novo), atualizar_petshop_db.sql (ajusta um banco existente)
│                e seed.sql (dados de exemplo, opcional)
├── preview/     Pré-visualização interativa (abre no navegador, com dados de exemplo)
└── docs/        apresentacao-petcare.pdf e capturas das telas do app
```

## Como executar

1. **Banco** (`petshop_db`)
   ```bash
   # Já tem o petshop_db? Rode uma vez para ajustá-lo:
   mysql -u root -p < database/atualizar_petshop_db.sql
   # Banco novo (no lugar do comando acima):
   mysql -u root -p < database/schema.sql
   # Dados de exemplo (opcional, uma vez só):
   mysql -u root -p < database/seed.sql
   ```
   No Windows, use o caminho completo do programa, por exemplo
   `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"`, ou rode os scripts pelo MySQL Workbench.

2. **API** (porta 3000)
   ```bash
   cd backend
   cp .env.example .env    # no Windows: copy .env.example .env — depois coloque a senha do MySQL
   npm install
   npm start
   ```
   Teste em http://localhost:3000/api/saude.

3. **App**
   ```bash
   cd mobile
   npm install
   npx expo start --web    # abre no navegador em http://localhost:8081
   ```
   Para usar no celular com o Expo Go: copie `mobile/.env.example` para `mobile/.env`, coloque o IP do
   computador em `EXPO_PUBLIC_API_URL` (ex.: `http://192.168.0.10:3000/api`) e rode `npx expo start`.

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/resumo` | Totais do painel e próximos agendamentos |
| GET | `/api/animais` | Lista animais (com `total_servicos`) |
| GET | `/api/animais/:id` | Detalhes + histórico de serviços |
| POST | `/api/animais` | Cadastra animal |
| PUT | `/api/animais/:id` | Atualiza animal |
| DELETE | `/api/animais/:id` | Exclui animal e os serviços dele (transação) |
| GET | `/api/servicos?status=&animal_id=` | Lista serviços (filtros opcionais) |
| GET | `/api/servicos/:id` | Detalhes do serviço com o animal |
| POST | `/api/servicos` | Cadastra serviço |
| PUT | `/api/servicos/:id` | Atualiza serviço |
| DELETE | `/api/servicos/:id` | Exclui serviço |
| GET | `/api/saude` | Verifica API e banco |

Erros retornam `{ "erro": "mensagem", "campos": { "campo": "mensagem" } }` com status 400, 404, 500 ou 503.

## Banco de dados

- **animais:** id, nome, especie, raca, idade, tutor, telefone, observacoes
- **servicos:** id, animal_id (chave estrangeira), tipo, data, valor, status, observacoes
- `ON DELETE CASCADE`: ao excluir um animal, os serviços dele também são excluídos.
- Tipos: `banho`, `tosa`, `consulta`, `vacinacao`, `hospedagem`, `outro`.
  Status: `agendado`, `em_andamento`, `concluido`.

## Apresentação

Os slides estão em [`docs/apresentacao-petcare.pdf`](docs/apresentacao-petcare.pdf) e as telas do app em [`docs/telas/`](docs/telas/).

## Autor

Ana Sprenger

## Licença

Projeto desenvolvido para fins educacionais.
