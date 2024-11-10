import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStadiumDto {
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsNumber()
  @IsNotEmpty()
  ownerId: number;

  @IsString()
  @IsNotEmpty()
  contact_with: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  volume: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  regionId: number;

  @IsNumber()
  @IsNotEmpty()
  districtId: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  buildAt: string;

  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  end_time: string;
}
