import { IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class UpdateUser {
    @IsString()
    @IsNotEmpty()
    @Length(2,150)
    @IsOptional()
    username?: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @IsOptional()
    password?: string

}