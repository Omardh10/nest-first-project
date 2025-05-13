import { Module } from "@nestjs/common";
import { UserController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { UserService } from "./users.service";
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from "@nestjs/config";
import { AuthProvider } from "./auth.provider";
import { MaileModule } from "../mail/mail.module";

@Module({
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([User]),
        MaileModule,
    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
            return {
                global: true,
                secret: config.get<string>("JWT_SECRET_KEY"),
                signOptions: { expiresIn: config.get<string>("JWT_EXPIRES_IN") }
            }
        }
    })
    ],
    providers: [UserService, AuthProvider],
    exports: [UserService]
})
export class UsersModule {

}