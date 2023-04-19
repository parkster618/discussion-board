import { config } from 'dotenv';
import { resolve } from 'path';

export async function setUpEnvironment(): Promise<void> {
    config({ path: resolve(__dirname, '..', `environment/${process.env.NODE_ENV}.env`) });
}