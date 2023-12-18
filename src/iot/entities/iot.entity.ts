import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Iot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  device_name: string;

  @Column()
  sensor_type: string;

  @Column()
  status: boolean;
}
