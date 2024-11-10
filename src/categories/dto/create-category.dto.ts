import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({
    example:""
  })
  name: string;
  parentId?: number;
}
