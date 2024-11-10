import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { User } from "../../users/models/user.model";

interface IUserWalletCreationAttr{
    userId:number
    wallet:number
}

@Table({ tableName: "user_wallets", timestamps: false })
export class UserWallet extends Model<UserWallet, IUserWalletCreationAttr> {
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
  wallet: number;
}
