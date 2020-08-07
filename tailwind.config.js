const config = require('./src/modules/client/tailwind.config');

// Since tailwind config files can only be at the root of a project, this file has to exist
module.exports = { ...config };
