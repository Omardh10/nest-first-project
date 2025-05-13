import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderItem {
    @IsNumber()
    @IsNotEmpty()
    quantity: number

    @IsNumber()
    @IsNotEmpty()
    productId: number
}