import { Column, DataType, Model, Table, HasMany } from "sequelize-typescript";
import { District } from "../../district/models/district.model";
import { Stadium } from "../../stadium/models/stadium.model";

interface IRegionCreationAttr {
  name: string;
}

@Table({ tableName: "region", timestamps: false })
export class Region extends Model<Region, IRegionCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @HasMany(() => District)
  districts: District;

  @HasMany(() => Stadium)
  stadiums: Stadium;
}
