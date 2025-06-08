# Contrato Next.js Project

This project uses Next.js and Tailwind CSS to create a contract generation form and API.

## Development

1. Install dependencies:
   ```
   npm install
   ```
   If the environment doesn't have internet access, configure a proxy or local npm registry.
2. Run the development server:
   ```
   npm run dev
   ```
3. Build the project:
   ```
   npm run build
   ```
4. Certifique-se de utilizar o Node.js na versão 18 ou superior, conforme definido em `package.json`.

## Functionality

- The form in `pages/index.js` collects user data (including Estado civil and Profissão) and posts it to `/api/gerarContrato`.
- The API fills `Contrato Vitorino.docx` with the provided data using Docxtemplater and then emails the result using the credentials defined in `EMAIL_USER` and `EMAIL_PASS` environment variables. O arquivo não é salvo em disco no ambiente serverless da Vercel.
- Ensure that the Word template contains the placeholders `[EstadoCivil]` and `[Profissão]`.
  Esses marcadores devem ser escritos exatamente dessa forma, sem espaços ou
  quebras adicionais, para que a API consiga localizá-los corretamente. Caso o Word insira marcas de correção que quebrem o texto em várias tags, a API tenta unir as partes automaticamente, mas revise o modelo para mantê-los contínuos.

## Interface

O formulário foi modernizado com Tailwind CSS e agora utiliza um layout em grade de duas colunas. Todos os campos são obrigatórios e exibem mensagem de status durante o envio.

## Email configuration

Create a `.env.local` file in the project root (see `.env.local.example` for reference) and define the Gmail credentials used to send the contract:

**Importante:** este arquivo contem dados sensíveis e não deve ser versionado no Git.

```
EMAIL_USER=seuusuario@gmail.com
EMAIL_PASS=sua_senha_ou_app_password
```

Se sua conta usar verificação em duas etapas, crie uma senha de aplicativo no painel de segurança do Google e use esse valor em `EMAIL_PASS`.
