import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs-extra';
import jwtDecode from 'jwt-decode';
import * as path from 'path';
import { UserPayloadInterface } from 'src/common/interfaces/user-payload.interface';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    // console.log();
    const bearerToken = request.headers['authorization'];
    const userAgent = request.headers['user-agent'] || '';
    let loggerText = '';
    let folder_name = '';
    let spBearerToken = [];
    if (bearerToken) {
      spBearerToken = bearerToken.split('Bearer ');
    }
    let userId = undefined;
    response.on('finish', () => {
      const { statusCode, statusMessage } = response;
      if (statusCode === 401) {
        folder_name = path.join(
          __dirname,
          '../../',
          process.env.APPLICATION_AUTH_LOG,
        );
      } else if (statusCode >= 400 && statusCode !== 401) {
        if (spBearerToken.length > 0) {
          const tokenDecrypt: UserPayloadInterface = jwtDecode(
            spBearerToken[1],
          );
          userId = tokenDecrypt.id;
        }

        folder_name = path.join(
          __dirname,
          '../../',
          process.env.APPLICATION_ERROR_LOG,
        );
      } else {
        folder_name = path.join(
          __dirname,
          '../../',
          process.env.APPLICATION_ACCESS_LOG,
        );
      }
      const contentLength = request.headers['content-length'];
      loggerText = `${new Date(
        Date.now(),
      ).toLocaleString()} - ${method} - ${originalUrl} - ${statusCode} - ${statusMessage} - ${contentLength} - ${userAgent} - ${ip} - ${userId}`;

      fs.createFileSync(`${folder_name}`);
      fs.appendFile(`${folder_name}`, loggerText + '\r\n');
      this.logger.log(loggerText);
    });

    next();
  }
}
