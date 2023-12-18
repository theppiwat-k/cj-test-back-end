import {
  HttpException,
  HttpStatus,
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
    const existDeviceName = await this.findOne({
      where: {
        device_name: createIotDto.device_name,
      },
    });

    if (existDeviceName) {
      throw new HttpException(
        'This device name already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

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

  async findAll(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;
    try {
      const [data, total] = await this.iotRepository.findAndCount({
        skip: skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      return new HttpException(
        {
          items: data,
          total: total,
          totalPages: totalPages,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(criteria: Record<string, any>): Promise<any> {
    try {
      const iot = await this.iotRepository.findOne(criteria);
      return iot;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateIotDto: Partial<UpdateIotDto>): Promise<any> {
    const existDeviceName = await this.findOne({
      where: {
        device_name: updateIotDto.device_name,
      },
    });

    if (existDeviceName && existDeviceName.id !== id) {
      throw new HttpException(
        'This device name already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

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
