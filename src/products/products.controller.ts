import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateProduct } from "./dtos/create.dto";
import { ProductService } from "./products.service";
import { UpdateProduct } from "./dtos/update.dto";
import { CurrentUser } from "../users/decorators/currentuser.decorator"
import { JwtPayload } from "../utils/types"
import { Roles } from "../users/decorators/userrole.decorator"
import { UserType } from "../utils/enums"
import { AuthRoleGuard } from "../users/guards/authrole.guard"

@Controller("/api/products")
export class ProductController {

   constructor(private readonly productservice: ProductService) { }

   @Get("")
   public getall(
      @Query('title') title: string,
      @Query('minprice') minprice: string,
      @Query('maxprice') maxprice: string,
   ) {
      return this.productservice.get_all_products(title, minprice, maxprice)
   }

   @Post("/create")
   @Roles(UserType.ADMIN)
   @UseGuards(AuthRoleGuard)
   public createproduct(@Body() body: CreateProduct, @CurrentUser() payload: JwtPayload) {
      return this.productservice.create_product(body, payload.id)
   }

   @Put(":id")
   @Roles(UserType.ADMIN)
   @UseGuards(AuthRoleGuard)
   public updateproduct(@Body() body: UpdateProduct, @Param("id", ParseIntPipe) id: number) {
      return this.productservice.update_product(body, id)
   }

   @Get(":id")
   public getproduct(@Param("id", ParseIntPipe) id: number) {
      this.productservice.get_single_product(id)
   }

   @Delete(":id")
   @Roles(UserType.ADMIN)
   @UseGuards(AuthRoleGuard)
   public deleteproduct(@Param("id", ParseIntPipe) id: number) {
      return this.productservice.delete_product(id)
   }
}