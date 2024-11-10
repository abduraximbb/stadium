import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "John Doe", description: "Enter user's name" })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    example: "johndoe@gmail.com",
    description: "Enter user's email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "+998990000000",
    description: "Enter user's phone(UZ phone)",
  })
  @IsPhoneNumber("UZ")
  phone: string;

  @ApiProperty({
    example: "@johndoe",
    description: "Enter user's telegram username",
  })
  @IsOptional()
  @IsString()
  tg_link: string;

  @ApiProperty({
    example: "123456",
    description: "Enter user's password(minLength(6))",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: "123456",
    description: "Enter user's confirm password",
  })
  confirm_password: string;

  @ApiProperty({ example: "photo.png", description: "Enter user's photo path" })
  @IsOptional()
  @IsString()
  photo: string;
}