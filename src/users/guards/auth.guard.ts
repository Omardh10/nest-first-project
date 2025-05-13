import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "src/utils/types";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtservice: JwtService,
        private readonly config: ConfigService
    ) { }
    async canActivate(context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(" ") ?? []
        if (token && type === 'Bearer') {
            try {
                const payload: JwtPayload = await this.jwtservice.verifyAsync(token, { secret: this.config.get<string>("JWT_SECRET_KEY") })
                request["user"] = payload
            } catch (error) {
                 throw new UnauthorizedException("invalid token ....")
            }

        } else {
            throw new UnauthorizedException("token not found ....")
        }
        return true
    }
}