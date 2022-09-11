import { AdminSerivce } from './modules/admin';
import { AuthService } from './modules/auth';
import { FiltersService } from './modules/filters';
import { TfaService } from './modules/tfa';
import { BrandsService } from './services/brands.service';
import { PhonesService } from './services/phones.service';
import { ReviewsService } from './services/reviews.service';
import { StocksService } from './services/stocks.service';
import { UsersService } from './services/users.service';

export const SERVICES = [
  AuthService,
  UsersService,
  TfaService,
  BrandsService,
  PhonesService,
  AdminSerivce,
  StocksService,
  FiltersService,
  ReviewsService,
];
