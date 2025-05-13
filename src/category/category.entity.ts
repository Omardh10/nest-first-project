import { Product } from "src/products/products.entity";
import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)'
@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => User, (user) => user.categories)
    user: User

    @ManyToMany(() => Product, (pro) => pro.categories)
    products: Product[]

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    creadetAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
}