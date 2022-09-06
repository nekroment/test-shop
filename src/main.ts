import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { testDataSet } from './resources/utilities/testDataSet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await testDataSet();
  await app.listen(3000);
}
bootstrap();
