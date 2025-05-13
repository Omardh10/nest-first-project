import { Test, TestingModule } from "@nestjs/testing"
import { ProductService } from "./products.service"
import { UserService } from "../users/users.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Product } from "./products.entity"
import { CreateProduct } from "./dtos/create.dto"
import { Repository } from "typeorm"

describe('ProductService', () => {
    let productservice: ProductService;
    let productrepo: Repository<Product>;
    const REPOSITORY_TOKEN = getRepositoryToken(Product);
    const createProduct: CreateProduct = {
        title: "book",
        description: "kjdnckjsd v skjvn w",
        price: 55
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: UserService, useValue: {
                        get_single_user: jest.fn((userId: number) => Promise.resolve({ id: userId }))
                    }
                },
                {
                    provide: REPOSITORY_TOKEN, useValue: {
                        create: jest.fn((dto: CreateProduct) => dto),
                        save: jest.fn((dto: CreateProduct) => Promise.resolve({ ...dto, id: 1 })),
                        findOne: jest.fn((id: number) => Promise.resolve({ id: 1 }))
                    }
                }
            ]
        }).compile()
        productservice = module.get<ProductService>(ProductService);
        productrepo = module.get<Repository<Product>>(REPOSITORY_TOKEN);
    })

    it('should product service be defined ', () => {
        expect(productservice).toBeDefined();
    })
    it('should product ripository be defined ', () => {
        expect(productrepo).toBeDefined();
    })

    /*********/

    describe('create_product()', () => {
        it('should create product active ... ', async () => {
            await productservice.create_product(createProduct, 1)
            expect(productrepo.create).toHaveBeenCalled()
            expect(productrepo.create).toHaveBeenCalledTimes(1)
        })
        it('should save product active ... ', async () => {
            await productservice.create_product(createProduct, 1)
            expect(productrepo.save).toHaveBeenCalled()
            expect(productrepo.save).toHaveBeenCalledTimes(1)
        })
        it('should create a new product ', async () => {
            const result = await productservice.create_product(createProduct, 1);
            expect(result).toBeDefined();
            expect(result.title).toBe('book');
            expect(result.price).toBe(55);
        })
    })
    describe("get_single_product()", () => {
        it("should be findOne active ", async () => {
            await productservice.get_single_product(1)
            expect(productrepo.findOne).toHaveBeenCalled()
            expect(productrepo.findOne).toHaveBeenCalledTimes(1)
        })
        it("should be single product function active ... ", async () => {
            const result2 = await productservice.get_single_product(1)
            expect(result2).toBeDefined()
        })
    })
})