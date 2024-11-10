import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { UserCard } from "../../user_cards/models/user_card.model";
import { UserWallet } from "../../user_wallet/models/user_wallet.model";

interface IUserCreationAttr {
  full_name: string;
  email: string;
  phone: string;
  tg_link: string;
  hashed_password: string;
  photo: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, IUserCreationAttr> {
  @ApiProperty({
    example: 1,
    description: "User unique ID",
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: "Sardor Sardorov",
    description: "User full name",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @ApiProperty({
    example: "sadorsardorov@gmail.com",
    description: "User's email",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @ApiProperty({
    example: "+998991234567",
    description: "User's phone",
  })
  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @ApiProperty({
    example: "@sardorov",
    description: "User's telegram username",
  })
  @Column({
    type: DataType.STRING,
  })
  tg_link: string;

  @ApiProperty({
    example: "password",
    description: "User's hashed password",
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @ApiProperty({
    example: "photo.png",
    description: "User's photo path",
  })
  @Column({
    type: DataType.STRING,
  })
  photo: string;

  @ApiProperty({
    example: false,
    description: "User's is_active(defaultvalue:false)",
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @ApiProperty({
    example: false,
    description: "User's is_owner(defaultvalue:false)",
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_owner: boolean;

  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @Column({
    type: DataType.STRING,
  })
  activation_link: string;

  @HasMany(() => UserCard)
  cards: UserCard;

  @HasMany(() => UserWallet)
  wallets: UserWallet;
}
