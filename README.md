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

## Functionality

- The form in `pages/index.js` collects user data (including Estado civil and Profissão) and posts it to `/api/gerarContrato`.
- The API fills `Contrato Vitorino.docx` with the provided data using Docxtemplater and then emails the result using the credentials defined in `EMAIL_USER` and `EMAIL_PASS` environment variables. O arquivo não é salvo em disco no ambiente serverless da Vercel.
- Ensure that the Word template contains the placeholders `[EstadoCivil]` and `[Profissão]`.
Create a `.env.local` file in the project root (see `.env.local.example` for reference) and define the Gmail credentials used to send the contract:

**Importante:** este arquivo contem dados sensíveis e não deve ser versionado no Git.

Se sua conta usar verificação em duas etapas, crie uma senha de aplicativo no painel de segurança do Google e use esse valor em `EMAIL_PASS`.

Create a `.env.local` file in the project root and define the Gmail credentials used to send the contract:

```
EMAIL_USER=seuusuario@gmail.com
EMAIL_PASS=sua_senha_ou_app_password
```

If sua conta usa verificação em duas etapas, crie uma senha de aplicativo no painel de segurança do Google e use esse valor em `EMAIL_PASS`.
