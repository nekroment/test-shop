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

export interface GroupByMemory {
  phones: number;
  memory: number;
}

export interface GroupByRam {
  phones: number;
  ram: number;
}

export interface GroupByDiagonal {
  phones: number;
  diagonal: number;
}

export interface GroupByBattery {
  phones: number;
  battery: number;
}

export interface GroupByCamera {
  phones: number;
  camera: number;
}

export interface GroupByOs {
  phones: number;
  os: OS;
}

export interface PriceRange {
  min: number;
  max: number;
}
