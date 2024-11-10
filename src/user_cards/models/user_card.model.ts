import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { User } from "../../users/models/user.model"

interface IUserCardsCreationAttr{
    userId:number
    name:string
    phone:string
    number:string
    year:number
    month:number
    is_active:boolean
    is_main:boolean
}

@Table({ tableName: "user_cards", timestamps: false })
export class UserCard extends Model<UserCard, IUserCardsCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;
  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
  })
  number: string;

  @Column({
    type: DataType.INTEGER,
  })
  year: number;

  @Column({
    type: DataType.INTEGER,
  })
  month: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_main: boolean;
}
