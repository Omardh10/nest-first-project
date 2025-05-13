import { Injectable, NotFoundException, UseGuards } from "@nestjs/common"
import { CreateProduct } from "./dtos/create.dto"
import { UpdateProduct } from "./dtos/update.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Product } from "./products.entity"
import { Between, Like, Repository } from "typeorm"
import { UserService } from "../users/users.service"



@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productrepositary: Repository<Product>,
        private readonly usersirvices: UserService
    ) { }
    /**
     * 
     * @returns Get_All_Product from db
     */
    public async get_all_products(title: string, minprice: string, maxprice: string) {
        const filters = {
            ...(title ? { title: Like(`%${title.toLocaleLowerCase()}%`) } : {}),
            ...(minprice && maxprice ? { price: Between(parseInt(minprice), parseInt(maxprice)) } : {})
        }
        const products = await this.productrepositary.find({
            where: filters,
            relations: ["user", "reviwes"],
            select: {
                user: {
                    id: true,
                    username: true
                },
                reviwes: {
                    id: true,
                    comment: true,
                }
            }
        });
        return products;
    }

    /**
     * 
     * @param id 
     * @returns Get_Single_Product from db
     */
    public async get_single_product(id: number) {
        const product = await this.productrepositary.findOne({ where: { id } })

        if (!product) throw new NotFoundException(" product not found ")

        return product;
    }

    /**
     * 
     * @param createdto 
     * @param userId 
     * @returns Create_New_Product in db
     */
    public async create_product(createdto: CreateProduct, userId: number) {
        const user = await this.usersirvices.get_single_user(userId);
        let new_user = this.productrepositary.create({
            ...createdto,
            title: createdto.title.toLocaleLowerCase(),
            user
        })
        return this.productrepositary.save(new_user);
    }

    /**
     * 
     * @param updatedto 
     * @param id 
     * @returns Update_Product in db
     */
    public async update_product(updatedto: UpdateProduct, id: number) {

        const { title, description, price } = updatedto;

        const product = await this.productrepositary.findOne({ where: { id } })

        if (!product) throw new NotFoundException(" product not found ")

        product.title = title ?? product.title
        product.description = description ?? product.description
        product.price = price ?? product.price

        return this.productrepositary.save(product);
    }

    /**
     * 
     * @param id 
     * @returns Remove_Product from db
     */
    public async delete_product(id: number) {

        const product = await this.get_single_product(id);
        await this.productrepositary.remove(product);
        return { message: "product deleted seccussfully ..." }
    }
}