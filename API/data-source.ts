import { Prompt } from 'entity/Prompt';
import { Reply } from 'entity/Reply';
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
    await dataSource.initialize();
}
