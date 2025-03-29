import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Role } from '../../auth/role.enum';
import { Review } from '../../reviews/entities/review.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { History } from '../../movies/entities/history.entity';

@Table
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  displayName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
  })
  picture: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: Role;

  @HasMany(() => Review, { onDelete: 'CASCADE', hooks: true })
  reviews!: Review[];

  @HasMany(() => Movie, { onDelete: 'CASCADE', hooks: true })
  movies!: Movie[];

  @HasMany(() => History, { onDelete: 'CASCADE', hooks: true })
  histories!: History[];
}
