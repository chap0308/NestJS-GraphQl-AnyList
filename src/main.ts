import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //*class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,//*esto sirve para que no nos envien más informacion de la que esperamos en un REST Tradicional.
      //! pero esto no es necesario en graphql, ya que este mismo valida que no nos envien informacion demás.
      //? Tambien lo desactivamos para tener multiplesArgs en items/items.resolver( NEST+GRAPHQL seccion 10- 123)
    })
  );

  await app.listen(3000);

}
bootstrap();
