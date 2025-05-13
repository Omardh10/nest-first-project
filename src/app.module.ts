import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestMiddleware, RequestMethod } from '@nestjs/common';
import { ProductModule } from './products/products.module';
import { RivwsModule } from './rivwes/rivwes.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/products.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.entity';
import { Reviwe } from './rivwes/reviwes.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UploadModule } from './uploads/uploads.module';
import { MaileModule } from './mail/mail.module';
import { LoggerMiddleware } from './utils/middleware/logger.middleware';
import { NextFunction, Request, Response } from 'express';
import { ThrottlerModule } from '@nestjs/throttler';
import { datasourceoptions } from 'db/data-source';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
@Module({
  imports: [
    ProductModule,
    RivwsModule,
    UsersModule,
    UploadModule,
    MaileModule,
    OrderModule,
    CategoryModule,
    TypeOrmModule.forRoot(datasourceoptions),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})

export class AppModule implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      })
  }

}


/**database local */

// {
//   inject: [ConfigService],
//   useFactory: (config: ConfigService) => {
//     return {
//       type: 'postgres',
//       database: config.get<string>("DATA_BASE"),
//       username: config.get<string>("USER_NAME"),
//       password: config.get<string>("PASSWORD"),
//       port: config.get<number>("PORT"),
//       host: 'localhost',
//       synchronize: process.env.NODE_ENV !== 'production',
//       entities: [Product, User, Reviwe]
//     }
//   }
// }
