import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterUser } from "./dtos/createuser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from "../utils/types";
import { LoginUser } from "./dtos/loginuser.dto";
import { MailService } from "../mail/mail.service";
import { randomBytes } from "crypto";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersrepositary: Repository<User>,
        private readonly jwtservice: JwtService,
        private readonly mailservice: MailService,
        private readonly config: ConfigService
    ) { }
    public async register_user(registerdto: RegisterUser) {
        const { username, email, password } = registerdto;

        const Old_User = await this.usersrepositary.findOne({ where: { email } })

        if (Old_User) throw new BadRequestException("this user already registered")

        const hashpassword = await bcrypt.hash(password, 10);

        let newuser = this.usersrepositary.create({
            username,
            email,
            password: hashpassword,
            VerificationToken: randomBytes(32).toString('hex')
        })

        newuser = await this.usersrepositary.save(newuser)
        const link = `${this.config.get<string>("DOMAIN_URL")}/api/users/verify-email/${newuser.id}/${newuser.VerificationToken}`
        await this.mailservice.sendinverifyemail(email, link)
        const payload: JwtPayload = { id: newuser.id, usertype: newuser.usertype }
        const accesstoken = await this.jwtservice.signAsync(payload)
        return { message: "verification tolen has been sent to your email please verify your email address" };
        /**message: "verification tolen has been sent to your email please verify your email address" */
    }

    public async login_user(logindto: LoginUser) {
        const { email, password } = logindto;

        const user = await this.usersrepositary.findOne({ where: { email } })
        if (!user) throw new BadRequestException("invalid email or password")

        const passwordcompare = await bcrypt.compare(password, user.password)
        if (!passwordcompare) throw new BadRequestException("invalid email or password")

        if (!user.VerificationToken) {
            let VerificationToke = user.VerificationToken;

            if (!VerificationToke) {
                user.VerificationToken = randomBytes(32).toString('hex');
                const resutl = await this.usersrepositary.save(user);
                VerificationToke = resutl.VerificationToken
            }
            const link = `${this.config.get<string>("DOMAIN_URL")}/api/users/verify-email/${user.id}/${user.VerificationToken}`
            await this.mailservice.sendinverifyemail(email, link);
            return { message: "verification email has been sent to your email message about that pleae verify your account" }
        }else{

        const payload: JwtPayload = { id: user.id, usertype: user.usertype }
        const accesstoken = await this.jwtservice.signAsync(payload)
        await this.mailservice.sendingemail(user.email);
        return { user, accesstoken };
    }
}
}