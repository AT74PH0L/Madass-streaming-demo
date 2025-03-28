import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Review } from '../../reviews/entities/review.entity';
import { History } from './history.entity';

@Table
export class Movie extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pathImg: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;

  @HasMany(() => Review, { onDelete: 'CASCADE', hooks: true })
  reviews!: Review[];

  @HasMany(() => History, { onDelete: 'CASCADE', hooks: true })
  histories!: History[];
}
