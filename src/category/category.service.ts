import { Injectable, NotFoundException } from "@nestjs/common";
import { Category } from "./category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCategory } from "./dtos/category.dto";
import { UserService } from "src/users/users.service";
import { UpdateCategory } from "./dtos/updatecategory.dto";

@Injectable()
export class CategoryServcie {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        private readonly userServise: UserService
    ) { }

    public async GetCategories() {

        const categories = await this.categoryRepo.find();
        return categories;

    }

    public async GetSingleCategory(categoryId: number) {

        const category = await this.categoryRepo.findOne({ where: { id: categoryId } })
        if (!category) throw new NotFoundException("category not found");
        return category;

    }

    public async CreateCategory(data: CreateCategory, userId: number) {

        const user = await this.userServise.get_single_user(userId);
        const { title } = data;
        const newcategory = this.categoryRepo.create({
            title: title,
            user
        })

        return this.categoryRepo.save(newcategory);

    }

    public async UpdateCategory(data: UpdateCategory, categoryId: number) {

        const category = await this.GetSingleCategory(categoryId);
        category.title = data.title ?? category.title
        return this.categoryRepo.save(category);

    }

    public async DeleteCategory(categoryId: number) {

        const category = await this.GetSingleCategory(categoryId);
        await this.categoryRepo.remove(category);
        return { message: "category deleted successfully" };

    }
}