import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class LoginUser {

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