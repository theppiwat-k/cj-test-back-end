import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Iot } from './entities/iot.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIotDto } from './dto/create-iot.dto';
import { UpdateIotDto } from './dto/update-iot.dto';

@Injectable()
export class IotSerivce {
  constructor(
    @InjectRepository(Iot) private readonly iotRepository: Repository<Iot>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createIotDto: CreateIotDto): Promise<any> {
    const iot = new Iot();
    iot.device_name = createIotDto.device_name;
    iot.sensor_type = createIotDto.sensor_type;
    iot.status = createIotDto.status;
    try {
      await this.iotRepository.save(iot);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    return iot;
  }

  async findAll(): Promise<any> {
    return this.iotRepository.find();
  }

  async findOne(id: number): Promise<any> {
    try {
      const iot = await this.iotRepository.findOneBy({ id });
      return iot;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateIotDto: Partial<UpdateIotDto>): Promise<any> {
    const iot = await this.iotRepository.findOneBy({ id });
    if (!iot) {
      throw new NotFoundException('Iot not found');
    }
    Object.assign(iot, updateIotDto);
    try {
      return await this.iotRepository.update(id, updateIotDto);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async delete(id: number): Promise<any> {
    const iot = await this.iotRepository.find({
      where: {
        id: id,
      },
    });
    if (!iot) {
      throw new NotFoundException('Iot not found');
    }
    try {
      await this.iotRepository.delete(id);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
