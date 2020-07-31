import 'dotenv/config';
import 'module-alias/register';
import { start } from './server';

if (process.env.NODE_ENV === 'development') start();

export { createServer } from './server';
