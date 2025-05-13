import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCategory {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    title: string
}