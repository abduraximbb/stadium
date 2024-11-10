import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/models/admin.model';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { Response } from 'express';
import * as bcrypt from "bcrypt";
import { SignInDto } from './dto/signIn.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService
  ) {}

  async generateTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
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

  async signUp(createAdminDto: CreateAdminDto, res: Response) {
    const admin = await this.adminService.findByLogin(createAdminDto.login);
    if (admin) {
      throw new BadRequestException("Bunday admin mavjud");
    }

    if (createAdminDto.password !== createAdminDto.confirm_password) {
      throw new BadRequestException("Parollar mos emas");
    }

    const newAdmin = await this.adminService.create(createAdminDto);
    const tokens = await this.generateTokens(newAdmin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    newAdmin.hashed_refresh_token = hashed_refresh_token;
    await newAdmin.save();

    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    const response = {
      message: "Admin registired success",
      user: newAdmin,
      access_token: tokens.access_token,
    };

    return response;
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const admin = await this.adminService.findByLogin(signInDto.login);
    if (!admin) {
      throw new UnauthorizedException("Admin not found");
    }
    const validPassword = await bcrypt.compare(
      signInDto.password,
      admin.hashed_password
    );
    if (!validPassword) {
      throw new UnauthorizedException("Admin not found");
    }

    const tokens = await this.generateTokens(admin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    admin.hashed_refresh_token = hashed_refresh_token;
    await admin.save();

    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    const response = {
      message: "Admin success signed",
      user: admin,
      access_token: tokens.access_token,
    };

    return response;
  }

  async refreshToken(refreshToken: string, res: Response, id: number) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const admin = await this.adminService.findOne(payload.id);
      if (!admin) {
        throw new UnauthorizedException("This admin not found");
      }

      if (id !== admin.id) {
        throw new BadRequestException("This another admin");
      }

      const valid_refresh_token = await bcrypt.compare(
        refreshToken,
        admin.hashed_refresh_token
      );
      if (!valid_refresh_token) {
        throw new UnauthorizedException("So'rovda xatolik");
      }

      const tokens = await this.generateTokens(admin);
      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

      admin.hashed_refresh_token = hashed_refresh_token;
      await admin.save();

      res.cookie("refresh_token", tokens.refresh_token, {
        httpOnly: true,
        maxAge: +process.env.REFRESH_TIME_MS,
      });

      return {
        message: "Admin success refreshed tokens",
        access_token: tokens.access_token,
      };
    } catch (error) {
      throw new BadRequestException("Expired token");
    }
  }

  async activateAdmin(id: number) {
    const admin = await this.adminService.findOne(id)
    if (!admin) {
      throw new BadRequestException("Bunday admin topilmadi");
    }
    if (admin.is_active) {
      throw new BadRequestException("Admin activlashtirilgan");
    }
    admin.is_active = true;
    await admin.save();
    const response = {
      message: "Admin activlashtirildi",
      is_active: true,
    };
    return response;
  }
}
