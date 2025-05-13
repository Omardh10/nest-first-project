import { Body, Controller, Delete, Get, Param, ParseIntPipe, PayloadTooLargeException, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ReviweService } from "./reviwes.service";
import { CreateReviwe } from "./dtos/createreviwe.dto";
import { UpdateReviwe } from "./dtos/updatereviwe.dto";
import { CurrentUser } from "src/users/decorators/currentuser.decorator";
import { Roles } from "src/users/decorators/userrole.decorator";
import { UserType } from "src/utils/enums";
import { AuthRoleGuard } from "src/users/guards/authrole.guard";
import { JwtPayload } from "src/utils/types";


@Controller("/api/reviwes")
export class ReviweController {

    constructor(private readonly reviweservice: ReviweService) { }

    @Get("")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRoleGuard)
    public getall(@Query('PageNumber', ParseIntPipe) PageNumber: number, @Query('ReviweCount', ParseIntPipe) ReviweCount: number,) {
        return this.reviweservice.get_all_reviwes(PageNumber, ReviweCount)
    }

    @Post("/:id")
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @UseGuards(AuthRoleGuard)
    public createreviwe(@Body() body: CreateReviwe, @Param("id", ParseIntPipe) id: number, @CurrentUser() payload: JwtPayload) {
        return this.reviweservice.create_reviwe(body, id, payload.id)
    }

    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @UseGuards(AuthRoleGuard)
    @Put(":id")
    public updatereviwe(@Body() body: UpdateReviwe, @Param("id", ParseIntPipe) id: number, @CurrentUser() payload: JwtPayload) {
        return this.reviweservice.update_reviwe(body, id, payload.id);
    }

    @Get(":id")
    public getreviwe(@Param("id", ParseIntPipe) id: number) {
        this.reviweservice.get_single_reviwe(id)
    }

    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @UseGuards(AuthRoleGuard)
    @Delete(":id")
    public deletereviwe(@Param("id", ParseIntPipe) id: number, @CurrentUser() Payload: JwtPayload) {
        return this.reviweservice.delete_reviwe(id, Payload.id)
    }
}