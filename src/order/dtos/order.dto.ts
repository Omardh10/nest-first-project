import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateOrderItem } from './orderitem.dto';

export class CreateOrder {
    @IsString()
    @IsNotEmpty()
    phonenumber: string

    @IsString()
    @IsNotEmpty()
    place: string

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItem)
    items: CreateOrderItem[]

}