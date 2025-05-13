import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "src/utils/types";
import { UserService } from "../users.service";
import { UserType } from "src/utils/enums";


@Injectable()
export class AuthRoleGuard implements CanActivate {
    constructor(
        private readonly jwtservice: JwtService,
        private readonly config: ConfigService,
        private readonly reflactor: Reflector,
        private readonly userservice: UserService
    ) { }
    async canActivate(context: ExecutionContext) {
        const roles: UserType[] = this.reflactor.getAllAndOverride('roles', [context.getHandler(), context.getClass()]);

        if (!roles || roles.length === 0) {
            return false;
        }
        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(" ") ?? []
        if (token && type === 'Bearer') {
            try {
                const payload: JwtPayload = await this.jwtservice.verifyAsync(token, { secret: this.config.get<string>("JWT_SECRET_KEY") })
                const user = await this.userservice.get_single_user(payload.id)
                if (!user) return false;

                if (roles.includes(user.usertype)) {
                    request["user"] = payload
                    return true;
                }


                request["user"] = payload
            } catch (error) {
                throw new UnauthorizedException("invalid token ....")
            }

        } else {
            throw new UnauthorizedException("token not found ....")
        }
        return false;
    }
}