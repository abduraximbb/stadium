import { Column, DataType, Model, Table , ForeignKey, BelongsTo, HasMany} from "sequelize-typescript";
import { Region } from "../../region/models/region.model";
import { Stadium } from "../../stadium/models/stadium.model";

interface IDistrictCreationAttr {
  name: string;
  regionId:number
}

@Table({ tableName: "district", timestamps: false })
export class District extends Model<District, IDistrictCreationAttr> {
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

  @ForeignKey(() => Region)
  @Column({
    type: DataType.INTEGER,
  })
  regionId: number;

  @BelongsTo(()=>Region)
  region: Region

  @HasMany(()=>Stadium)
  stadiums:Stadium
}
