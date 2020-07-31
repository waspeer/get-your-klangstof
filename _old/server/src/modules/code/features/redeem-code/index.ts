import createFeature from './redeem-code';
import codeRepo from '../../infra/repo';

const redeemCode = createFeature(codeRepo);

export default redeemCode;
