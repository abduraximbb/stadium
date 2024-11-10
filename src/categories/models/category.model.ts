import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Stadium } from "../../stadium/models/stadium.model";

interface ICategoriesCreationAttr {
  name: string;
  parentId: number;
}

@Table({ tableName: "categories", timestamps: false })
export class Categories extends Model<Categories, ICategoriesCreationAttr> {
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

  @ForeignKey(() => Categories)
  @Column({
    type: DataType.INTEGER,
  })
  parentId: number;

  @BelongsTo(() => Categories)
  category: Categories;

  @HasMany(()=>Stadium)
  stadiums:Stadium
}
