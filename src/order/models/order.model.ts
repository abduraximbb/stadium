import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";

interface IOrderAttr {
  description: string;
  status: string;
  date: string;
}

@Table({ tableName: "order", timestamps: false })
export class Order extends Model<Order, IOrderAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.ENUM("paid", "unpaid"),
    defaultValue: "unpaid",
  })
  status: string;

  @Column({
    type: DataType.DATE,
    defaultValue: Date.now(),
  })
  date: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
