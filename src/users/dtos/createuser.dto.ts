import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class RegisterUser {
    @IsString()
    @IsNotEmpty()
    @Length(2,150)
    username: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Length(2,250)
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string
 
}