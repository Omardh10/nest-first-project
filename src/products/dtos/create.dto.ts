import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateProduct {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number

    @IsNumber()
    @Min(0)
    stock: number
}