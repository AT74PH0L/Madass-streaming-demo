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
    const users = await this.usersRepository.findAll();
    return users.map((user) => ({
      id: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picture: user.picture,
      role: user.role,
    }));
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (user) {
      return {
        id: user.id,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        picture: user.picture,
        role: user.role,
      };
    }
    return null;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (user) {
      const updateUser = await user.update(updateUserDto);
      return {
        id: updateUser.id,
        displayName: updateUser.displayName,
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        email: updateUser.email,
        picture: updateUser.picture,
        role: updateUser.role,
      };
    }
    return null;
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (user) {
      await user.destroy();
    }
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email: email } });
  }
}
