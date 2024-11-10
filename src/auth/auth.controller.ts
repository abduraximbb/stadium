import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { Request, Response } from 'express';
import { SignInDto } from './dto/signIn.dto';

@ApiTags("AUTH for admin")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("add")
  async signUp(
    @Body() createAdminDto: CreateAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signUp(createAdminDto, res);
  }

  @Post("signin")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signIn(signInDto, res);
  }

  @Post("refreshtoken/:id")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param("id") id: string
  ) {
    const refreshToken = req.cookies["refresh_token"];
    return this.authService.refreshToken(refreshToken, res,+id);
  }

  @Get("activate/:id")
  async activateAdmin(@Param("id") id:string){
    return this.authService.activateAdmin(+id)
  }
}
