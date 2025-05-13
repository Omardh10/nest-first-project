import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateReviwe{
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    comment?: string

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    @IsOptional()
    rating?: number
}