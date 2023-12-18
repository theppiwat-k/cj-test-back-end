import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateIotDto {
  @IsString()
  @IsNotEmpty()
  device_name: string;

  @IsString()
  @IsNotEmpty()
  sensor_type: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
