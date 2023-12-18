import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { hash } from '../utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existEmail = await this.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    const existUsername = await this.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    if (existEmail) {
      throw new HttpException(
        'This email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (existUsername) {
      throw new HttpException(
        'This username already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User();
    user.username = createUserDto.username;
    user.password = await hash(createUserDto.password);
    user.email = createUserDto.email;
    try {
      await this.entityManager.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(criteria: Record<string, any>) {
    try {
      const user = this.userRepository.findOne(criteria);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    try {
      await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
