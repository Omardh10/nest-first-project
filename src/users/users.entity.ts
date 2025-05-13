import { Product } from "../products/products.entity";
import { Reviwe } from "../rivwes/reviwes.entity";
import { UserType } from "../utils/enums";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { Order } from "src/order/ordre.entity";
import { Category } from "src/category/category.entity";
const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: '150', nullable: true })
    username: string;

    @Column({ type: 'varchar', length: '250', unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @OneToMany(() => Product, (product) => product.user)
    products: Product[]

    @OneToMany(() => Category, (categ) => categ.user)
    categories: Category[]

    @OneToMany(() => Reviwe, (reviwe) => reviwe.user)
    reviwes: Reviwe[]

    @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
    usertype: UserType

    @Column({ nullable: true, default: null })
    profilePhoto: string

    @Column({ type: 'bool', default: false })
    isAccount: boolean;

    @Column({ nullable: true })
    VerificationToken: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    creadetAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
}