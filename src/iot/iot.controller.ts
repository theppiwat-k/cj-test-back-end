import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.iotService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.iotService.findOne({
      where: {
        id: id,
      },
    });
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
