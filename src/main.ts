import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestException,
  Logger,
  RequestMethod,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from './common/interceptors/global-response.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';

const SWAGGER_ENVS = ['development', 'local'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger('ApplicationStartUp'),
  });
  //set global prefix for api routes
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  //enable api versioning for routes
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // exception factory for custom validation error message as key value pair
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const response_data = {};

        validationErrors.filter(function (values) {
          if (values.children && values.children.length > 0) {
            values.children.map((element) => {
              if (element.children && element.children.length > 0) {
                //check for multi level validation error message
                element.children.map((elementNext) => {
                  response_data[elementNext.property] = [];
                  Object.keys(elementNext.constraints).map((k) => {
                    response_data[elementNext.property].push(
                      elementNext.constraints[k],
                    );
                  });
                });
              } else {
                response_data[element.property] = [];
                Object.keys(element.constraints).map((k) => {
                  response_data[element.property].push(element.constraints[k]);
                });
              }
            });
          } else {
            response_data[values.property] = Object.keys(
              values.constraints,
            ).map((k) => values.constraints[k]);
          }
        });
        return new BadRequestException(response_data);
      },
    }),
  );

  //global response interceptor
  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  //global exception filter for DB/HTTP
  app.useGlobalFilters(new HttpExceptionFilter());

  if (SWAGGER_ENVS.includes(process.env.NODE_ENV || 'development')) {
    app.use(
      ['/apidoc'],
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      }),
    );
  }

  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('Nest API application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  const api_port = parseInt(process.env.APP_PORT) || 4005;
  await app.listen(api_port);

  //log application startup
  Logger.log(`🚀 Application is running on port: ${api_port}`);
  Logger.log(`🚀 Server running at ${await app.getUrl()}`);
  Logger.log(`🚀 Api doc server started at ${await app.getUrl()}/apidoc`);
}
bootstrap();
