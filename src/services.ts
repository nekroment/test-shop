import { AdminSerivce } from './modules/admin';
import { AuthService } from './modules/auth';
import { TfaService } from './modules/tfa';
import { BrandsService } from './services/brands.service';
import { PhonesService } from './services/phones.service';
import { UsersService } from './services/users.service';

export const SERVICES = [
  AuthService,
  UsersService,
  TfaService,
  BrandsService,
  PhonesService,
  AdminSerivce,
];
