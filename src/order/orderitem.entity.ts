import { Product } from "src/products/products.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./ordre.entity";
const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)'

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal' })
    price: number;

    @Column({ type: 'int', default: 0 })
    quantity: number

    @ManyToOne(() => Product, (product) => product.orderitems)
    product: Product

    @ManyToOne(() => Order, (order) => order.items, { 
        onDelete: 'CASCADE' 
    })
    order: Order

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    creadetAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
}