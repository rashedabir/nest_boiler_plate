import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs-extra';
import jwtDecode from 'jwt-decode';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const isDebug = request.headers['debug'];
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || exception.response || exception;

    if (typeof exception === 'object') {
      status = exception.status;
      message =
        exception.response && exception.response.statusCode == undefined
          ? exception.response
          : exception.message;
    } else {
      status = HttpStatus.BAD_REQUEST;
      message = 'BAD_REQUEST';
    }
    if (isDebug) {
      const folder_name = path.join(
        __dirname,
        '../../',
        process.env.APPLICATION_DEBUG_LOG,
      );
      const { ip, method, originalUrl } = request;
      const userAgent = request.headers['user-agent'] || '';
      const bearerToken = request.headers['authorization'];
      let spBearerToken = [];
      if (bearerToken) {
        spBearerToken = bearerToken.split('Bearer ');
      }
      let userId = undefined;
      if (spBearerToken.length > 0) {
        const tokenDecrypt: any = jwtDecode(spBearerToken[1]);
        userId = tokenDecrypt.id;
      }

      const contentLength = request.headers['content-length'];
      const loggerText = `${new Date(
        Date.now(),
      ).toLocaleString()} - ${method} - ${originalUrl} - ${status} - ${'Bad Request'} - ${exception} - ${contentLength} - ${userAgent} - ${ip} - ${userId}`;

      fs.createFileSync(`${folder_name}`);
      fs.appendFile(`${folder_name}`, loggerText + '\r\n');
    }
    response.status(status).send({
      statusCode: status,
      message: message ?? 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      error: true,
    });
  }
}
