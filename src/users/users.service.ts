import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model";

import * as uuid from "uuid";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { MailService } from "../mail/mail.service";
import { SignInDto } from "./dto/signIn.dto";
import { PhoneUserDto } from "./dto/phone-user.dto";
import * as otpGenerator from "otp-generator";
import { BotService } from "../bot/bot.service";
import { Otp } from "../otp/models/otp.model";
import { AddMinutesToDate } from "../helpers/addMinutes";
import { decode, encode } from "../helpers/crypto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { SmsService } from "../sms/sms.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Otp) private otpModel: typeof Otp,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly botService: BotService,
    private readonly smsService: SmsService
  ) {}

  async generateTokens(user: User) {
    const payload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async signUp(createUserDto: CreateUserDto, res: Response) {
    const user = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });
    // if (user) {
    //   throw new BadRequestException("Bunday foydalanuvchi mavjud");
    // }

    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException("Parollar mos emas");
    }

    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const newUser = await this.userModel.create({
      ...createUserDto,
      hashed_password,
    });
    const tokens = await this.generateTokens(newUser);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const activation_link = uuid.v4();

    const updatedUser = await this.userModel.update(
      {
        hashed_refresh_token,
        activation_link,
      },
      {
        where: { id: newUser.id },
        returning: true,
      }
    );
    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    try {
      await this.mailService.sendMail(updatedUser[1][0]);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Xat yuborishda xatolik");
    }

    const response = {
      message: "User registired",
      user: updatedUser[1][0],
      access_token: tokens.access_token,
    };

    return response;
  }

  async activateUser(link: string) {
    const exists_user = await this.userModel.findOne({
      where: { activation_link: link },
    });
    if (!exists_user) {
      throw new BadRequestException("Bunday user topilmadi");
    }
    if (exists_user.is_active) {
      throw new BadRequestException("User activlashtirilgan");
    }
    exists_user.is_active = true;
    await exists_user.save();
    const response = {
      message: "User activlashtirildi",
      is_active: true,
    };
    return response;
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const user = await this.userModel.findOne({
      where: { email: signInDto.email },
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const validPassword = await bcrypt.compare(
      signInDto.password,
      user.hashed_password
    );
    if (!validPassword) {
      throw new UnauthorizedException("User not found");
    }

    const tokens = await this.generateTokens(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const activation_link = uuid.v4();

    const updatedUser = await this.userModel.update(
      {
        hashed_refresh_token,
        activation_link,
      },
      {
        where: { id: user.id },
        returning: true,
      }
    );
    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    try {
      await this.mailService.sendMail(updatedUser[1][0]);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Xat yuborishda xatolik");
    }

    const response = {
      message: "User registired",
      user: updatedUser[1][0],
      access_token: tokens.access_token,
    };

    return response;
  }

  async signOut(refreshToken: string, res: Response) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    const user = await this.userModel.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new BadRequestException("User topilmadi");
    }

    await this.userModel.update(
      { hashed_refresh_token: null },
      { where: { id: user.id } }
    );

    res.clearCookie("refresh_token");

    return {
      message: "User success logouted",
    };
  }

  async refreshToken(refreshToken: string, res: Response) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const user = await this.userModel.findOne({ where: { id: payload.id } });
      if (!user) {
        throw new UnauthorizedException("User topilmadi");
      }

      const valid_refresh_token = await bcrypt.compare(
        refreshToken,
        user.hashed_refresh_token
      );
      if (!valid_refresh_token) {
        throw new UnauthorizedException("So'rovda xatolik");
      }

      const tokens = await this.generateTokens(user);
      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

      await this.userModel.update(
        { hashed_refresh_token },
        { where: { id: user.id } }
      );

      res.cookie("refresh_token", tokens.refresh_token, {
        httpOnly: true,
        maxAge: +process.env.REFRESH_TIME_MS,
      });

      return {
        access_token: tokens.access_token,
      };
    } catch (error) {
      throw new BadRequestException("Expired token");
    }
  }

  async newOtp(phoneUserDto: PhoneUserDto) {
    const phone_number = phoneUserDto.phone;

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const isSend = await this.botService.sendOtp(phone_number, otp);

    if (!isSend) {
      throw new BadRequestException("Avval botdan ro'yxatdan o'ting");
    }
    //SMS
    // const response = await this.smsService.sendSms(phone_number,otp)

    // if(response.status!==200){
    //   throw new ServiceUnavailableException("OTP yuborishda xatolik")
    // }

    const message = `OTP code has been send to ****`+phone_number.slice(phone_number.length-4)

    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 5);
    await this.otpModel.destroy({ where: { phone_number } });

    const newOtp = await this.otpModel.create({
      id: uuid.v4(),
      otp,
      expiration_time,
      phone_number,
    });

    const details = {
      timestamp: now,
      phone_number,
      otp_id: newOtp.id,
    };
    const encodedData = await encode(JSON.stringify(details));

    return { message: "OTP telegramga yuborildi", details: encodedData , sms:message};
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { verification_key, otp, phone_number } = verifyOtpDto;
    const curentDate = new Date();
    const decodedDate = await decode(verification_key);
    const details = JSON.parse(decodedDate);
    if (details.phone_number != phone_number) {
      throw new BadRequestException("OTP bu raqamga yuborilmagan");
    }

    const resultOtp = await this.otpModel.findOne({
      where: { id: details.otp_id },
    });
    if (!resultOtp) {
      throw new BadRequestException("Bunday OTP mavjud emas");
    }

    if (resultOtp.verified) {
      throw new BadRequestException("Bu OTP avval tekshirilgan");
    }

    if (resultOtp.expiration_time < curentDate) {
      throw new BadRequestException("Bu OTPning vaqti tugagan");
    }

    if (resultOtp.otp != otp) {
      throw new BadRequestException("OTP mos emas");
    }

    const user = await this.userModel.update(
      {
        is_owner: true,
      },
      {
        where: { phone: phone_number },
        returning: true,
      }
    );
    if (!user[1][0]) {
      throw new BadRequestException("Bunday foydalanuvchi yo'q");
    }

    await this.otpModel.update(
      {
        verified: true,
      },
      {
        where: { id: details.otp_id },
      }
    );
    const response = {
      message:"Siz owner bo'ldingiz",
      owner:user[1][0].is_owner
    }

    return response
  }

  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  findAll() {
    return this.userModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
