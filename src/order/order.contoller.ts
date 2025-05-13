import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/users/guards/auth.guard";
import { CreateOrder } from "./dtos/order.dto";
import { CurrentUser } from "src/users/decorators/currentuser.decorator";
import { JwtPayload } from "src/utils/types";
import { OrderService } from "./order.service";
import { AuthRoleGuard } from "src/users/guards/authrole.guard";
import { Roles } from "src/users/decorators/userrole.decorator";
import { UserType } from "src/utils/enums";
import { UpdateOrder } from "./dtos/updateorder.dto";

@Controller("/api/orders")
export class OrderController {


    constructor(private readonly orderservice: OrderService) { }
    @Get("")
    @UseGuards(AuthRoleGuard)
    @Roles(UserType.ADMIN)
    public async getallorders() {
        return this.orderservice.getorders()
    }

    @Get("get-order")
    @UseGuards(AuthGuard)
    public async getsingleorder(payload: JwtPayload) {
        return this.orderservice.get_single_order(payload.id)
    }

    @Post("/create-order")
    @UseGuards(AuthGuard)
    public createproduct(@Body() body: CreateOrder, @CurrentUser() payload: JwtPayload) {
        return this.orderservice.createOrder(body, payload.id)
    }

    @Put("/update-order/:orderId")
    @UseGuards(AuthRoleGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public async update_order(@Body() updateorder: UpdateOrder, @CurrentUser() payload: JwtPayload, @Param("orderId", ParseIntPipe) orderId: number) {
        return this.orderservice.updateorder(updateorder, payload.id, orderId)
    }

    @Delete("/delete-order/:orderId")
    @UseGuards(AuthRoleGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public async delete_order(@CurrentUser() payload: JwtPayload, @Param("orderId", ParseIntPipe) orderId: number) {
        return this.orderservice.deleteorder(payload.id, orderId);
    }
}
