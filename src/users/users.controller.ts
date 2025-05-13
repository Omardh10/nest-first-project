import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./users.service";
import { UpdateUser } from "./dtos/updateuser.dto";
import { LoginUser } from "./dtos/loginuser.dto";
import { RegisterUser } from "./dtos/createuser.dto";
import { AuthGuard } from "./guards/auth.guard";
import { JwtPayload } from "../utils/types";
import { CurrentUser } from "./decorators/currentuser.decorator";
import { Roles } from "./decorators/userrole.decorator";
import { UserType } from "../utils/enums";
import { AuthRoleGuard } from "./guards/authrole.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Express, Response } from "express";


@Controller("/api/users")
export class UserController {

    constructor(private readonly userservice: UserService) { }

    @Get("")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRoleGuard)
    public getall() {
        return this.userservice.get_all_users()
    }

    @Post("/auth/register")
    public registeruser(@Body() body: RegisterUser) {
        return this.userservice.register_user(body)
    }

    @Post("/auth/login")
    @HttpCode(HttpStatus.OK)
    public loginuser(@Body() body: LoginUser) {
        return this.userservice.login_user(body)
    }

    @Get("/verify-email/:id/:verification")
    public gertverifiemail(@Param('id', ParseIntPipe) id: number, @Param('verification') verification: string) {
        return this.userservice.getverifyemail(id, verification);
    }

    @Post('/upload-profile-photo')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './images/users',
            filename: (req, file, cb) => {
                const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
                const filename = `${prefix}-${file.originalname}`;
                cb(null, filename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image')) {
                cb(null, true)
            } else {
                cb(new BadRequestException("uploaded images just"), false)
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 2
        }
    }))
    public uploadprofile(@UploadedFile() file: Express.Multer.File, @CurrentUser() payload: JwtPayload) {
        if (!file) throw new BadRequestException("no file provided");
        return this.userservice.upload_profile(payload.id, file.filename);
    }

    @Put("/update")
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @UseGuards(AuthRoleGuard)
    public updateuser(@Body() body: UpdateUser, @CurrentUser() payload: JwtPayload) {
        return this.userservice.update_user(body, payload.id)
    }

    @Put("/update-proflie-photo")
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './images/users',
            filename: (req, file, cb) => {
                const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
                const filename = `${prefix}-${file.originalname}`;
                cb(null, filename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image')) {
                cb(null, true)
            } else {
                cb(new BadRequestException("uploaded images just"), false)
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 2
        }
    }))
    @UseGuards(AuthGuard)
    public updateprofilephoto(@UploadedFile() file: Express.Multer.File, @CurrentUser() payload: JwtPayload) {
        return this.userservice.update_proflie_photo(file.filename, payload.id)
    }

    @Get("current-user")
    @UseGuards(AuthGuard)
    public getuser(@CurrentUser() payload: JwtPayload) {
        return this.userservice.get_single_user(payload.id)
    }

    @Delete("/delete-profile-photo")
    @UseGuards(AuthGuard)
    public deleteprofilephoto(@CurrentUser() payload: JwtPayload) {
        return this.userservice.delete_profile_photo(payload.id);
    }
}
