import getSheet from '#root/lib/google-sheet-client';

import GoogleSheetRepo from './google-sheet-repo';

const sheet = getSheet();
const googleSheetRepo = new GoogleSheetRepo(sheet);

export default googleSheetRepo;
