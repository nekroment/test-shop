import { AuthResolver } from './modules/auth';
import { TfaResolver } from './modules/tfa';

export const RESOLVERS = [AuthResolver, TfaResolver];
