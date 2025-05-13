import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UpdateCategory {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    @IsOptional()
    title?: string
}