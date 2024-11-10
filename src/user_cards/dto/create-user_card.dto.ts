import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserCardDto {
  @IsNumber()
  userId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber("UZ")
  phone: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsNumber()
  year: number;

  @IsNumber()
  month: number;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsBoolean()
  is_main: boolean;
}
