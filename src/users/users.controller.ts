import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Request, Response } from "express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./models/user.model";
import { SignInDto } from "./dto/signIn.dto";
import { UserGuard } from "../guards/user.guard";
import { PhoneUserDto } from "./dto/phone-user.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Signup new user" })
  @ApiResponse({
    status: 201,
    description: "Success registired new user",
    type: User,
  })
  @Post("signup")
  signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.usersService.signUp(createUserDto, res);
  }

  @ApiOperation({ summary: "Activate user" })
  @ApiResponse({
    status: 200,
    description: "Success activated user",
    type: Object,
  })
  @Get("activate/:link")
  activateUser(@Param("link") link: string) {
    return this.usersService.activateUser(link);
  }

  @ApiOperation({ summary: "Signin user" })
  @ApiResponse({
    status: 201,
    description: "Success signed user",
    type: User,
  })
  @Post("signin")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.usersService.signIn(signInDto, res);
  }

  @ApiOperation({ summary: "Signout user" })
  @ApiResponse({
    status: 201,
    description: "Success signouted user",
    type: Object,
  })
  @Post("signout")
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies["refresh_token"];
    return this.usersService.signOut(refreshToken, res);
  }

  @ApiOperation({ summary: "Refreshed user" })
  @ApiResponse({
    status: 201,
    description: "Success refreshed user",
    type: Object,
  })
  @Post("refreshtoken")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies["refresh_token"];
    return this.usersService.refreshToken(refreshToken, res);
  }

  @UseGuards(UserGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @HttpCode(200)
  @Post("newotp")
  newOtp(@Body() phoneUserDto: PhoneUserDto) {
    return this.usersService.newOtp(phoneUserDto);
  }

  @HttpCode(200)
  @Post("verifyotp")
  verifyOtp(@Body() verifyOtpDto:VerifyOtpDto) {
    return this.usersService.verifyOtp(verifyOtpDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
