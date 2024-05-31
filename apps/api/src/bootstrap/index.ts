import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ApiModule } from '../api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConstants } from '@app/utils';
import helmet from 'helmet';
import { AllExceptionsFilter } from '../filters/global.filter';
import { ValidationPipe } from '@nestjs/common';

export const bootstrap = async () => {
  const app = await NestFactory.create(ApiModule);

  const config = new DocumentBuilder()
    .setTitle('Deel API')
    .setDescription('Deel API hometask for backend developer')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(AppConstants.PORT);
};
