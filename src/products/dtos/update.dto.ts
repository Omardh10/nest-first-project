import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
export class UpdateProduct {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    @IsOptional()
    title?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @IsOptional()
    price?: number

    @IsNumber()
    @Min(0)
    @IsOptional()
    stock?: number
}