import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
    return { deleted: true };
  }

  async seed() {
    const samples: CreateUserDto[] = [
      { name: 'Taro Yamada', email: 'taro@example.com', password: 'pass1234' },
      { name: 'Hanako Sato', email: 'hanako@example.com', password: 'pass1234' },
      { name: 'John Doe', email: 'john@example.com', password: 'pass1234' },
    ];

    const users = this.userRepository.create(samples);
    return this.userRepository.save(users);
  }
}
