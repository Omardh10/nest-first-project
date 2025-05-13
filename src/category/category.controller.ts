import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/users/decorators/currentuser.decorator";
import { Roles } from "src/users/decorators/userrole.decorator";
import { AuthRoleGuard } from "src/users/guards/authrole.guard";
import { UserType } from "src/utils/enums";
import { JwtPayload } from "src/utils/types";
import { CreateCategory } from "./dtos/category.dto";
import { CategoryServcie } from "./category.service";
import { UpdateCategory } from "./dtos/updatecategory.dto";


@Controller("/api/categories")
export class CategoryController {
    constructor(private readonly categoryservice: CategoryServcie) { }

    @Post("/create")
    @UseGuards(AuthRoleGuard)
    @Roles(UserType.ADMIN)
    public async CreateCategory(@CurrentUser() payload: JwtPayload, @Body() body: CreateCategory) {
        return this.categoryservice.CreateCategory(body, payload.id);
    }

    @Get("")
    public async GetAllCategories() {
        return this.categoryservice.GetCategories()
    }

    @Get(":id")
    public async GetSingleCategory(@Param("id", ParseIntPipe) id: number) {
        return this.categoryservice.GetSingleCategory(id)
    }

    @Put(":id")
    @UseGuards(AuthRoleGuard)
    @Roles(UserType.ADMIN)
    public async UpdateCategory(@Body() body: UpdateCategory, @Param("id", ParseIntPipe) id: number) {
        return this.categoryservice.UpdateCategory(body, id);
    }

    @Delete(":id")
    @UseGuards(AuthRoleGuard)
    @Roles(UserType.ADMIN)
    public async DeleteCategory(@Param("id", ParseIntPipe) id: number) {
        return this.categoryservice.DeleteCategory(id);
    }

}