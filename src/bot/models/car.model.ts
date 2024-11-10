import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ICarCreationAttr {
  user_id: number;
  car_number: string;
  model: string;
  color: string;
  year: number;
  last_state: string;
}

@Table({ tableName: "car" })
export class Car extends Model<Car, ICarCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.BIGINT,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
  })
  car_number: string;

  @Column({
    type: DataType.STRING,
  })
  model: string;

  @Column({
    type: DataType.STRING,
  })
  color: string;

  @Column({
    type: DataType.INTEGER,
  })
  year: number;

  @Column({
    type: DataType.STRING,
  })
  last_state: string;
}
