import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { UpdateUser } from "./dtos/updateuser.dto"
import { RegisterUser } from "./dtos/createuser.dto"
import { LoginUser } from "./dtos/loginuser.dto"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./users.entity"
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from "../utils/types"
import { UserType } from "../utils/enums"
import { AuthProvider } from "./auth.provider"
import { join } from "path"
import { unlinkSync } from "fs"


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersrepositary: Repository<User>,
        private readonly authprovider: AuthProvider
    ) { }
    public async get_all_users() {
        const users = await this.usersrepositary.find();
        return users;
    }

    public async get_single_user(id: number) {
        const user = await this.usersrepositary.findOne({ where: { id } })
        if (!user) throw new NotFoundException("user not found");
        return user;
    }

    public async register_user(registerdto: RegisterUser) {
        return this.authprovider.register_user(registerdto);
    }

    public async login_user(logindto: LoginUser) {
        return this.authprovider.login_user(logindto);
    }

    public async upload_profile(userId: number, newfile: string) {
        const user = await this.get_single_user(userId);
        user.profilePhoto = newfile;
        return await this.usersrepositary.save(user);
    }

    public async update_user(updatedto: UpdateUser, id: number) {
        const { password, username } = updatedto;
        const user = await this.get_single_user(id);
        user.username = username ?? user.username;
        if (password) {
            const hashpassword = await bcrypt.hash(password, 10);
            user.password = hashpassword;
        }
        return this.usersrepositary.save(user);

    }

    public async update_proflie_photo(newfile: string, userId: number) {
        const user = await this.get_single_user(userId);
        if (user.profilePhoto === null) {
            throw new BadRequestException("not found profile photo")
        } else {
            await this.delete_profile_photo(userId);
            user.profilePhoto = newfile;
            await this.usersrepositary.save(user);
            return user;
        }
    }

    public async delete_user(id: number, payload: JwtPayload) {
        const user = await this.get_single_user(id)
        if (user.id === payload.id || user.usertype === UserType.ADMIN) {
            await this.usersrepositary.remove(user);
            return { message: "user deleted seccussfully !!! " }
        }
        throw new ForbiddenException("only user himself or userAdmin")
    }

    public async delete_profile_photo(userId: number) {
        const user = await this.get_single_user(userId);
        if (user.profilePhoto === null) throw new BadRequestException("not found profile photo")
        const pathimg = join(process.cwd(), `images/users/${user.profilePhoto}`)
        unlinkSync(pathimg);
        user.profilePhoto = '';
        await this.usersrepositary.save(user);
        return { message: "profile photo deleted successfully" }
    }

    public async getverifyemail(userId: number, verification: string) {
        const user = await this.get_single_user(userId);
        if (user.VerificationToken === null) {
            throw new NotFoundException("no verification token found ")
        }
        if (user.VerificationToken !== verification) {
            throw new BadRequestException("invalid verification token")
        }
        user.isAccount = true;
        user.VerificationToken = '';
        await this.usersrepositary.save(user);
        return { message: "your email has been verified please logIn..." }
    }
}