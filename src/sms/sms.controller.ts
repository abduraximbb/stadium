import { Body, Controller, Headers, Patch, Post } from '@nestjs/common';
import { SmsService } from './sms.service';

@Controller("sms")
export class SmsController {
  constructor(private readonly smsService: SmsService) {}
  @Post()
  create(@Body() email: string, password: string) {
    return this.smsService.getToken(email, password);
  }

  @Patch()
  update() {
    console.log(3);
    
    return this.smsService.refreshToken();
  }
}
