import { NestFactory } from '@nestjs/core';
import { ApiModule } from '../api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConstants } from '@app/utils';

export const bootstrap = async () => {
  const app = await NestFactory.create(ApiModule);

  const config = new DocumentBuilder()
    .setTitle('Deel API')
    .setDescription('Deel API hometask for backend developer')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(AppConstants.PORT);
};
