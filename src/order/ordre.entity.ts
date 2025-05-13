import { User } from "src/users/users.entity";
import { OrderType } from "src/utils/enums";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./orderitem.entity";
const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)'

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal' })
    totalPrice: number

    @Column({ type: 'enum', enum: OrderType, default: OrderType.PENDING })
    status: string

    @ManyToOne(() => User, (user) => user.orders)
    user: User

    @OneToMany(() => OrderItem, (item) => item.order)
    items: OrderItem[]

    @Column()
    phonenumber: string;

    @Column()
    place: string

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    creadetAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
}