import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Stadium } from "../../stadium/models/stadium.model";

interface IOwnerCreationAttr{
    full_name:string
}

@Table({ tableName: "owner" })
export class Owner extends Model<Owner, IOwnerCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: "Sardor Sardorov",
    description: "Owner full name",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @HasMany(()=>Stadium)
  stadiums:Stadium
}
