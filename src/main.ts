import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from "cookie-parser";

async function start() {
  try {
    const PORT = process.env.PORT || 3030;
    console.log(PORT);

    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());  
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix("api")

    const config = new DocumentBuilder()
      .setTitle("Stadium project")
      .setDescription("Stadium project REST API")
      .setVersion("1.0")
      .addTag("NESTJS, validation, swagger, guard, sequelize, pg, mailer, bot, sms")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
    await app.listen(PORT, () => {
      console.log(`Server started at: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
