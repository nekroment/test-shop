import { AuthService } from './modules/auth';
import { TfaService } from './modules/tfa';
import { UsersService } from './services/users.service';

export const SERVICES = [AuthService, UsersService, TfaService];
