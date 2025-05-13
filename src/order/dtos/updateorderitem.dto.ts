import { IsNotEmpty, IsNumber, IsOptional} from 'class-validator';

export class UpdateOrderItem {
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    quantity?: number

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    price?: number
}