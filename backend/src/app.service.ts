import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIsOn(): string {
    return 'working ✅';
  }
}
