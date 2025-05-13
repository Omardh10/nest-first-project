import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./ordre.entity";
import { OrderItem } from "./orderitem.entity";
import { Repository } from "typeorm";
import { CreateOrder } from "./dtos/order.dto";
import { ProductService } from "src/products/products.service";
import { Product } from "src/products/products.entity";
import { UserService } from "src/users/users.service";
import { UpdateOrder } from "./dtos/updateorder.dto";
import { UserType } from "src/utils/enums";

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Order)
        private readonly orderrepositary: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderitemrepo: Repository<OrderItem>,
        @InjectRepository(Product)
        private readonly productrepo: Repository<Product>,
        private readonly productservice: ProductService,
        private readonly userservice: UserService
    ) { }


    public async getorders() {
        const orders = await this.orderrepositary.find({
            relations: ["user"]
        }
        )
        return orders;
    }
    public async get_single_order(id: number) {
        const order = await this.orderrepositary.findOne({
            where: { id },
            relations: ["user"]
        })
        if (!order) throw new NotFoundException("order not found");
        return order;
    }

    public async createOrder(createdto: CreateOrder, userId: number) {
        const user = await this.userservice.get_single_user(userId);
        const { items } = createdto;

        let total = 0;
        const orderitems: OrderItem[] = [];

        for (const item of items) {
            const product = await this.productservice.get_single_product(item.productId)

            let orderitem = this.orderitemrepo.create({
                price: product.price,
                quantity: item.quantity,
                product
            })
            total += product.price * item.quantity
            orderitems.push(orderitem)
            product.stock -= item.quantity
            await this.productrepo.save(product);
            await this.orderitemrepo.save(orderitem)
        }
        const neworder = this.orderrepositary.create({
            ...createdto,
            totalPrice: total,
            user,
            items: orderitems
        })
        return this.orderrepositary.save(neworder);
    }

    public async updateorder(updateorder: UpdateOrder, userId: number, orderId: number) {
        const user = await this.userservice.get_single_user(userId);
        const order = await this.get_single_order(orderId);
        const { place, phonenumber, items, status } = updateorder;

        if (userId === order.user.id || user.usertype === UserType.ADMIN) {
            order.phonenumber = phonenumber ?? order.phonenumber;
            order.place = place ?? order.place;
            order.status = status ?? order.status

            if (items) {
                let total = 0;
                const newOrderItems: OrderItem[] = [];

                for (const oldItem of order.items) {
                    const product = await this.productservice.get_single_product(oldItem.product.id);
                    product.stock += oldItem.quantity;
                    await this.productrepo.save(product);
                    await this.orderitemrepo.remove(oldItem);
                }

                for (const item of items) {
                    const product = await this.productservice.get_single_product(item.productId);
                    if (product.stock < item.quantity) {
                        throw new BadRequestException(`Not enough stock for product ${product.id}`);
                    }
                    const orderItem = this.orderitemrepo.create({
                        price: product.price,
                        quantity: item.quantity,
                        product
                    });

                    total += product.price * item.quantity;
                    newOrderItems.push(orderItem);
                    product.stock -= item.quantity;
                    await this.productrepo.save(product);
                    await this.orderitemrepo.save(orderItem);
                }

                order.items = newOrderItems;
                order.totalPrice = total;
            }

            return this.orderrepositary.save(order);
        } else {
            throw new BadRequestException("you are not allow only user him self or user admin ");
        }
    }

    public async deleteorder(userId: number, orderId: number) {
        const user = await this.userservice.get_single_user(userId)
        const order = await this.get_single_order(orderId);
        if (userId === order.user.id || user.usertype === UserType.ADMIN) {
            await this.orderitemrepo.delete({ order: { id: orderId } });
            await this.orderrepositary.remove(order)

            return { message: "order deleted successfully ..." }
        } else {
            throw new BadRequestException("you are not allowed only userhim self or user admin ...")
        }
    }
}
