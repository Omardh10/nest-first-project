import { Product } from "src/products/products.entity";
import { Reviwe } from "src/rivwes/reviwes.entity";
import { User } from "src/users/users.entity";
import { DataSource, DataSourceOptions } from "typeorm";
import { config } from 'dotenv';
import { Order } from "src/order/ordre.entity";
import { OrderItem } from "src/order/orderitem.entity";
import { Category } from "src/category/category.entity";

config({ path: '.env' });

export const datasourceoptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Product, Reviwe,Order,OrderItem,Category],
    migrations: ["dist/db/migrations/*.js"]
}

export const datasource = new DataSource(datasourceoptions);
