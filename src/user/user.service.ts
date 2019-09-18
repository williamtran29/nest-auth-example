import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';

import { User } from './user.entity';
import { UserUpdate } from './dto/user-update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
    const user = new User(data);
    const existUser =
      (await this.userRepository.count({ email: data.email })) > 0;

    if (existUser) {
      throw new UnprocessableEntityException(
        `The email «${data.email}» is already register.`,
      );
    }

    return this.userRepository.save(user);
  }

  async findOne(where: FindOneOptions<User>) {
    const user = await this.userRepository.findOne(where);

    if (!user) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${where}`,
      );
    }

    return user;
  }

  async update(id, updates: UserUpdate) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
    Object.assign(user, updates);

    return this.userRepository.save(user);
  }
}