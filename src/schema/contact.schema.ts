import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Contact extends Model<Contact> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  linkedId?: number;

  @Column({
    type: DataType.ENUM,
    values: ['secondary', 'primary'],
    allowNull: false,
    defaultValue: 'primary',
  })
  linkPrecedence: 'secondary' | 'primary';

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt?: Date;
}
