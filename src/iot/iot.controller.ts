import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateIotDto } from './dto/update-iot.dto';
import { CreateIotDto } from './dto/create-iot.dto';
import { IotSerivce } from './iot.service';

@Controller('iot')
export class IotController {
  constructor(private iotService: IotSerivce) {}

  @Post()
  create(@Body() createIotDto: CreateIotDto) {
    return this.iotService.create(createIotDto);
  }

  @Get('/all')
  findAll() {
    return this.iotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.iotService.findOne(parseInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIotDto: UpdateIotDto) {
    return this.iotService.update(parseInt(id), updateIotDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.iotService.delete(parseInt(id));
  }
}
