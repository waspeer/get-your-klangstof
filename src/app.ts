import 'dotenv/config';
import 'module-alias/register';

import { Application } from './infrastructure/application';

Application.start();
