// Package imports
import express from 'express';

// Setup Scripts
import { initializeDataSource } from './data-source.js';

async function startApp() {
    await initializeDataSource();

    const PORT = process.env.PORT || 5000;
    const app = express()
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
    app.listen(PORT, () => console.log(`Listening on port ${ PORT }`));
}

startApp();