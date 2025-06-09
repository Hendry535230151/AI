# AI

This project is an AI-driven system designed to search, retrieve, and organize documentation and files based on user queries. Users can upload files, which the AI will categorize and store in a database, allowing for easy access and retrieval through a chat-based interface.

## AI % External API

    npm install @google/generative-ai
    npm install axios

## Server & backend

    npm install express
    npm install mysql2

## Security dependencies

    npm install nodemailer
    npm install bcrypt
    npm install jsonwebtoken
    npm install dotenv
    npm install cors

## Frontend depedencies

    npm install react-scripts --save
    npm install react-router-dom
    npm install react-markdown
    npm install aos

## Development & Testing

    npm install --save-dev jest
    npm install --save-dev nodemon
    npm install concurrently --save-dev

## Changin script in concurrently

{
"scripts": {
"start": "concurrently \"npm run server\" \"npm run client\"",
"server": "cd backend && npm start",
"client": "cd frontend && npm start"
},
"devDependencies": {
"concurrently": "^9.1.2"
}
}
