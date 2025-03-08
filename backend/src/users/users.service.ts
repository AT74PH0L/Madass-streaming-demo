import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly usersRepository: typeof User,
  ) {}
  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.create({
      displayName: createUserDto.displayName,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password: createUserDto.password,
      picture: createUserDto.picture,
      role: createUserDto.role,
    });
  }

  async findAll() {
    return await this.usersRepository.findAll();
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (user) {
      return user.update(updateUserDto);
    }
    return null;
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (user) {
      return user.destroy();
    }
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email: email } });
  }
}
