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
- The API fills `Contrato Vitorino.docx` with the provided data using Docxtemplater, saves the result, and emails it using the credentials defined in `EMAIL_USER` and `EMAIL_PASS` environment variables.
