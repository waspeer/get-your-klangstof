#!/usr/bin/env node

require('dotenv/config');
require('module-alias/register');
require('colors');

const addCodes = require('../dist/modules/code/features/add-codes').default;

const run = async () => {
  console.log('[ADD CODES]: start...'.bold.yellow);

  const result = await addCodes();

  if (result.isFailure()) {
    console.log('[ADD CODES]: finished with errors'.bold.red);
    console.error(result.error);
    process.exit(1);
  }

  console.log('[ADD CODES]: success!'.bold.green);
  process.exit();
};

run();
