import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { Categories } from "../../categories/models/category.model"
import { Owner } from "../../owner/models/owner.model"
import { Region } from "../../region/models/region.model"
import { District } from "../../district/models/district.model"

interface IStadiumCreationAttr{
    categoryId:number
    ownerId:number
    contact_with:string
    name:string
    volume:string
    address:string
    regionId:number
    districtId:number
    location:string
    buildAt:string
    start_time:string
    end_time:string
}

@Table({ tableName: "stadium" })
export class Stadium extends Model<Stadium, IStadiumCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Categories)
  @Column({
    type: DataType.INTEGER,
  })
  categoryId: number;
  @BelongsTo(() => Categories)
  category: Categories;

  @ForeignKey(() => Owner)
  @Column({
    type: DataType.INTEGER,
  })
  ownerId: number;
  @BelongsTo(() => Owner)
  owner: Owner;

  @Column({
    type: DataType.STRING,
  })
  contact_with: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  volume: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.INTEGER,
  })
  regionId: number;
  @BelongsTo(() => Region)
  region: Region;

  @ForeignKey(() => District)
  @Column({
    type: DataType.INTEGER,
  })
  districtId: number;
  @BelongsTo(() => District)
  district: District;

  @Column({
    type: DataType.STRING,
  })
  location: string;

  @Column({
    type: DataType.DATE,
  })
  buildAt: string;

  @Column({
    type: DataType.STRING,
  })
  start_time: string;

  @Column({
    type: DataType.STRING,
  })
  end_time: string;
}
