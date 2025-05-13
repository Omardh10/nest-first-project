import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateOrderItem } from './orderitem.dto';

export class UpdateOrder {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phonenumber?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    place?: string

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItem)
    @IsOptional()
    items?: CreateOrderItem[]

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    status?: string
}