// Package imports
import express, { Request, Response } from 'express';
import cors from 'cors';

// Setup Scripts
import { initializeDataSource } from './data-source.js';
import { setUpEnvironment } from './env-setup.js';
import { Prompt } from './entity/Prompt.js';
import { Reply } from './entity/Reply.js';

async function startApp() {
    await setUpEnvironment();
    await initializeDataSource();

    const PORT = process.env.PORT || 5001;
    const app = express()
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
    app.listen(PORT, () => console.log(`Listening on port ${ PORT }`));
    const corsOptions = { origin: [ 'https://park618.zapto.org', 'http://park618.zapto.org' ] };
    if (process.env.IS_TEST === 'true') {
        corsOptions.origin.push('http://localhost:4200');
    }
    app.use(cors(corsOptions));

    // Prompts endpoints
    app.get('/prompts', async (req: Request, res: Response) => {
        await tryResponse(res, Prompt.getAll);
        res.end();
    });
    
    // Replies endpoints
    app.post('/replies', async (req: Request, res: Response) => {
        const reply = new Reply();
        for (const key of Object.keys(req.body)) {
            if (Object.hasOwn(reply, key)) {
                reply[key] = req.body[key];
            }
        }
        await tryResponse(res, Reply.createOrUpdate, reply);
        res.end();
    });
}

startApp();

async function tryResponse(res: Response, func: (...args: any[]) => any, ...args: any[]) {
    try {
        res.send(await func(...args));
    } catch (e: any) {
        res.status(500)
        res.send(e.stack)
        console.error(e.stack)
    }
}
