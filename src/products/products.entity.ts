import { Order } from "src/order/ordre.entity";
import { Reviwe } from "../rivwes/reviwes.entity";
import { User } from "../users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "src/order/orderitem.entity";
import { Category } from "src/category/category.entity";

const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)'
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'float' })
    price: number;

    @OneToMany(() => Reviwe, (reviwe) => reviwe.product)
    reviwes: Reviwe[];

    @Column({ default: 0, type: 'int' })
    stock: number;

    @ManyToOne(() => User, (user) => user.products)
    user: User

    @OneToMany(() => OrderItem, (item) => item.product)
    orderitems: OrderItem[]

    @ManyToMany(()=>Category,(categ)=>categ.products)
    categories:Category[]

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    creadetAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
}