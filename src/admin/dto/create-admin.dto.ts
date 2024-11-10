import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAdminDto {
  @ApiProperty({ example: "john_doe", description: "Enter admin's login" })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    example: "@john_doe",
    description: "Enter admin's telegram link",
  })
  @IsString()
  @IsNotEmpty()
  tg_link: string;

  @ApiProperty({ example: "admin.photo.png", description: "Enter admin's photo path" })
  @IsString()
  @IsNotEmpty()
  photo: string;

  @ApiProperty({
    example: "Uzbek!$t0n",
    description:
      "Enter admin's password",
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  confirm_password:string

  is_active?: boolean;
  is_creator?: boolean;
}
