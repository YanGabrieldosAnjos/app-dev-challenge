import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class AuthenticateDto {
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}