import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findByKeycloakId(keycloakId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { keycloakId },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOrCreate(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.findByKeycloakId(createUserDto.keycloakId);

    if (!user) {
      user = await this.create(createUserDto);
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
