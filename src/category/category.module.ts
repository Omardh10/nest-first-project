import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryController } from "./category.controller";
import { CategoryServcie } from "./category.service";
import { Category } from "./category.entity";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";


@Module({
    controllers: [CategoryController],
    providers: [CategoryServcie],
    imports: [TypeOrmModule.forFeature([Category]), JwtModule, UsersModule],
    exports: [CategoryServcie]
})
export class CategoryModule {

}