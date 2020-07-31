import createFeature from './get-all-codes';
import codeRepo from '../../infra/repo';

const getAllCodes = createFeature(codeRepo);

export default getAllCodes;
