import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Iot } from './entities/iot.entity';
import { IotSerivce } from './iot.service';
import { IotController } from './iot.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Iot])],
  exports: [IotSerivce],
  controllers: [IotController],
  providers: [IotSerivce],
})
export class IotModule {}
