import { IsEmail, IsEnum, IsString, isString } from "@nestjs/class-validator";

export enum role {
    ADMIN="admin",
    USER="user"
}
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsEnum(role)
    role: string;
}