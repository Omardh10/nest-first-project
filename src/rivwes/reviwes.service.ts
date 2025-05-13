import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { CreateReviwe } from "./dtos/createreviwe.dto"
import { UpdateReviwe } from "./dtos/updatereviwe.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Reviwe } from "./reviwes.entity"
import { Repository } from "typeorm"
import { UserService } from "src/users/users.service"
import { ProductService } from "src/products/products.service"
import { UserType } from "src/utils/enums"
// import { JwtPayload } from "src/utils/types"

@Injectable()
export class ReviweService {
    constructor(
        @InjectRepository(Reviwe)
        private readonly revrepository: Repository<Reviwe>,
        private readonly userservice: UserService,
        private readonly productservice: ProductService
    ) { }
    public async get_all_reviwes(PageNumber: number, ReviweCount: number) {
        const reviwes = await this.revrepository.find({
            skip: ReviweCount * (PageNumber - 1),
            take: ReviweCount,
            order: { creadetAt: "ASC" }
        })
        return reviwes;
    }

    public async get_single_reviwe(id: number) {
        const reviwe = await this.revrepository.findOne({ where: { id } })
        if (!reviwe) throw new NotFoundException(" this reviwe not found ")
        return reviwe;
    }

    public async create_reviwe(createdto: CreateReviwe, productId: number, userId: number) {
        const user = await this.userservice.get_single_user(userId)
        if (!user) throw new NotFoundException("user not found")

        const product = await this.productservice.get_single_product(productId)
        if (!product) throw new NotFoundException("product not found")
        const new_reviwe = this.revrepository.create({
            ...createdto,
            product,
            user
        })
        const result = await this.revrepository.save(new_reviwe);
        return {
            id: result.id,
            comment: result.comment,
            rating: result.rating,
            userId: user.id,
            username: user.username,
            productId: product.id,
            creadetAt: result.creadetAt,
            updatedAt: result.updatedAt
        }
    }

    public async update_reviwe(updatedto: UpdateReviwe, id: number, userId: number) {
        const user = await this.userservice.get_single_user(userId);
        const reviwe = await this.get_single_reviwe(id);
        if (reviwe.user.id === userId || user.usertype === UserType.ADMIN) {
            reviwe.comment = updatedto.comment ?? reviwe.comment;
            reviwe.rating = updatedto.rating ?? reviwe.rating;
            return await this.revrepository.save(reviwe)
        } else {
            throw new ForbiddenException("you are not allowed onlu user or userAdmin")
        }

    }

    public async delete_reviwe(id: number, userId: number) {
        const user = await this.userservice.get_single_user(userId);
        const reviwe = await this.get_single_reviwe(id);
        if (user.usertype = UserType.ADMIN || reviwe.user.id === userId) {
            await this.revrepository.remove(reviwe);
            return { message: "reviwe deleted successfully !!!" }
        } else {
            throw new ForbiddenException("you are not allowed only user or userAdmin")
        }
    }
}