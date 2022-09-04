import { AdminResolver } from './modules/admin/admin.resolver';
import { AuthResolver } from './modules/auth';
import { FiltersResolver } from './modules/filters';
import { TfaResolver } from './modules/tfa';

export const RESOLVERS = [
  AuthResolver,
  TfaResolver,
  AdminResolver,
  FiltersResolver,
];
