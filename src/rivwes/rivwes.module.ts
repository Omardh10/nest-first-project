import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reviwe } from "./reviwes.entity";
import { ReviweController } from "./rivwes.controller";
import { ReviweService } from "./reviwes.service";
import { ProductModule } from "src/products/products.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    controllers: [ReviweController],
    imports: [TypeOrmModule.forFeature([Reviwe]),ProductModule,UsersModule,JwtModule],
    providers:[ReviweService]
})
export class RivwsModule {

}