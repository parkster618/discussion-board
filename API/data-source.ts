import { Prompt } from './entity/Prompt.js';
import { Reply } from './entity/Reply.js';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export let dataSource: DataSource;
export async function initializeDataSource(): Promise<void> {
    dataSource = new DataSource({
        type: 'mariadb',
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DBNAME,
        synchronize: true,
        logging: false,
        entities: [Prompt, Reply],
        subscribers: [],
        migrations: [],
    });
    console.log('Connecting DB... ' + process.env.DB_DBNAME + ' at ' + process.env.DB_USERNAME + '@' + process.env.DB_HOST);
    await dataSource.initialize();
    console.log('Database connected: ' + process.env.DB_DBNAME + ' at ' + process.env.DB_USERNAME + '@' + process.env.DB_HOST);
}
