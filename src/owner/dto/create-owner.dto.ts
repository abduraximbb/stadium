import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateOwnerDto {
  @ApiProperty({ example: "John Doe", description: "Enter owner's name" })
  @IsString()
  @IsNotEmpty()
  full_name: string;
}
