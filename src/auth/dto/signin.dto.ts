import { Expose } from 'class-transformer';

export class SigninDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;
}
