import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // NOTE: use transform propertym
  // app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3005);
}
bootstrap();
