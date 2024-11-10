import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    description:string

    @IsNotEmpty()
    @IsNumber()
    userId:number
}
