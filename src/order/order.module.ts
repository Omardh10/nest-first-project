import { Module } from "@nestjs/common";
import { OrderController } from "./order.contoller";
import { OrderService } from "./order.service";
import { UsersModule } from "src/users/users.module";
import { ProductModule } from "src/products/products.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./ordre.entity";
import { OrderItem } from "./orderitem.entity";
import { JwtModule } from "@nestjs/jwt";
import { Product } from "src/products/products.entity";


@Module({
    controllers: [OrderController],
    providers: [OrderService],
    imports: [UsersModule, ProductModule,JwtModule, TypeOrmModule.forFeature([Order, OrderItem,Product])]
})
export class OrderModule {

}