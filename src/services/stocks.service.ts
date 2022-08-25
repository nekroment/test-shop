import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Stocks } from './../entities/stocks.entity';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stocks)
    private stocksRepository: Repository<Stocks>,
  ) {}

  async createStock(
    phone: number,
    percentage: number,
    date: Date,
  ): Promise<void> {
    const stock = this.stocksRepository.create({
      phone: {
        id: phone,
      },
      percentage,
      end_time: date,
    });
    await this.stocksRepository.save(stock);
  }
}
