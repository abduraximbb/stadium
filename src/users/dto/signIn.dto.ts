import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @ApiProperty({
    example: "johndoe@gmail.com",
    description: "Enter user's email address",
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: "123456",
    description:
      "Enter  password min length(6)",
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
