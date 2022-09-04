import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Phones } from 'src/entities';
import {
  GroupByMemory,
  GroupByRam,
  GroupByBattery,
  GroupByCamera,
  GroupByDiagonal,
  GroupByOs,
  PriceRange,
  Phone,
} from 'src/resources';

@Injectable()
export class PhonesService {
  constructor(
    @InjectRepository(Phones)
    private phonesRepository: Repository<Phones>,
  ) {}

  async adminAddPhone(data: Phone): Promise<void> {
    const { name, price, brand, diagonal, memory, ram, images } = data;
    const phone = this.phonesRepository.create({
      name,
      price,
      brand: {
        id: brand,
      },
      diagonal,
      memory,
      ram,
      image: {
        images,
      },
    });
    await this.phonesRepository.save(phone);
  }

  async findPhoneById(id: number): Promise<Phones> {
    return await this.phonesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async groupByMemory(): Promise<
    [
      GroupByMemory[],
      GroupByRam[],
      GroupByDiagonal[],
      GroupByBattery[],
      GroupByCamera[],
      GroupByOs[],
      PriceRange[],
    ]
  > {
    return await Promise.all([
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'memory'])
        .groupBy('memory')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'ram'])
        .groupBy('ram')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'diagonal'])
        .groupBy('diagonal')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'battery'])
        .groupBy('battery')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'camera'])
        .groupBy('camera')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'os'])
        .groupBy('os')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['MIN(price) AS min', 'MAX(price) AS max'])
        .execute(),
    ]);
  }
}
