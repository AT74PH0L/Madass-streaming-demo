import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id: id } });
  }
}
