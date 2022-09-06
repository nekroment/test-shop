import { DataSource } from 'typeorm';

import { Brands, Phones } from 'src/entities';
import { OS } from '../enums';

const brandsName = [
  'Apple',
  'Huawei',
  'Samsung',
  'Xiaomi',
  'Realme',
  'OPPO',
  'Poco',
];

export const testDataSet = async () => {
  const db = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: process.env.BUILD
      ? ['dist/entities/*.entity.js']
      : ['src/entities/*.entity.ts'],
    // eslint-disable-next-line prettier/prettier
    migrations: process.env.BUILD
      ? ['dist/migrations/*.js']
      : ['migrations/*.ts'],
  });
  const connection = await db.initialize();
  const entityManager = connection.createEntityManager();
  const brands = await entityManager.find(Brands);
  if (brands.length > 0) {
    console.log('ALREADY GENERATED');
    return;
  }

  for (const brand of brandsName) {
    await entityManager.insert(Brands, {
      name: brand,
    });
  }

  await entityManager.insert(Phones, {
    name: 'Samsung Galaxy A32 4/128GB Black',
    price: 10399,
    memory: 128,
    ram: 4,
    diagonal: 6.4,
    battery: 5000,
    camera: 64,
    os: OS.ANDROID,
    image: {
      images: [
        'https://content1.rozetka.com.ua/goods/images/big_tile/175376690.jpg',
      ],
    },
    brand: {
      name: brandsName[2],
    },
  });

  await entityManager.insert(Phones, {
    name: 'Samsung Galaxy A13 4/128GB Black (SM-A135FZKKSEK)',
    price: 8799,
    memory: 128,
    ram: 4,
    diagonal: 6.6,
    battery: 5000,
    camera: 64,
    os: OS.ANDROID,
    image: {
      images: [
        'https://content.rozetka.com.ua/goods/images/big_tile/263916044.jpg',
      ],
    },
    brand: {
      name: brandsName[2],
    },
  });

  await entityManager.insert(Phones, {
    name: 'Apple iPhone 13 Pro 128GB Gold',
    price: 44999,
    memory: 128,
    ram: 6,
    diagonal: 6.1,
    battery: 5000,
    camera: 12,
    os: OS.IOS,
    image: {
      images: [
        'https://content1.rozetka.com.ua/goods/images/big_tile/221194930.jpg',
      ],
    },
    brand: {
      name: brandsName[0],
    },
  });

  await entityManager.insert(Phones, {
    name: 'Huawei Nova Y70 4/128GB Pearl White (51096YST)',
    price: 7499,
    memory: 128,
    ram: 6,
    diagonal: 6.1,
    battery: 5000,
    camera: 12,
    os: OS.ANDROID,
    image: {
      images: [
        'https://content2.rozetka.com.ua/goods/images/big_tile/278939504.jpg',
      ],
    },
    brand: {
      name: brandsName[1],
    },
  });

  await entityManager.insert(Phones, {
    name: 'HUAWEI P30 Lite 4/128GB Midnight Black',
    price: 10543,
    memory: 128,
    ram: 6,
    diagonal: 6.1,
    battery: 5000,
    camera: 12,
    os: OS.ANDROID,
    image: {
      images: [
        'https://content1.rozetka.com.ua/goods/images/big_tile/260257177.jpg',
      ],
    },
    brand: {
      name: brandsName[1],
    },
  });

  await entityManager.insert(Phones, {
    name: 'Xiaomi Redmi Note 11 4/64GB Twilight Blue',
    price: 8499,
    memory: 64,
    ram: 6,
    diagonal: 6.43,
    battery: 5000,
    camera: 12,
    os: OS.ANDROID,
    image: {
      images: [
        'https://content1.rozetka.com.ua/goods/images/big_tile/250758659.jpg',
      ],
    },
    brand: {
      name: brandsName[3],
    },
  });
};
