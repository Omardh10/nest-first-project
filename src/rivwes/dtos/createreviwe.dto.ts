import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviwe {
    @IsString()
    @IsNotEmpty()
    comment: string

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rating: number
}