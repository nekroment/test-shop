import { OS } from '../enums';

export interface Phone {
  name: string;
  price: number;
  brand: number;
  diagonal: number;
  memory: number;
  ram: number;
  battery: number;
  camera: number;
  os: OS;
  images?: string[];
}
