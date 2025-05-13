import { Product } from "../products/products.entity";
import { User } from "../users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)'
@Entity()
export class Reviwe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @Column({ type: 'int' })
    rating: number;

    @ManyToOne(() => Product, (product) => product.reviwes)
    product: Product

    @ManyToOne(() => User, (user) => user.reviwes,{eager:true})
    user: User

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    creadetAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
}