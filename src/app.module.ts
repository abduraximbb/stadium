import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ComfortModule } from "./comfort/comfort.module";
import { Comfort } from "./comfort/models/comfort.model";
import { RegionModule } from "./region/region.module";
import { Region } from "./region/models/region.model";
import { DistrictModule } from "./district/district.module";
import { District } from "./district/models/district.model";
import { CategoriesModule } from "./categories/categories.module";
import { Categories } from "./categories/models/category.model";
import { UsersModule } from "./users/users.module";
import { User } from "./users/models/user.model";
import { MailModule } from "./mail/mail.module";
import { UserCardsModule } from "./user_cards/user_cards.module";
import { UserCard } from "./user_cards/models/user_card.model";
import { UserWalletModule } from "./user_wallet/user_wallet.module";
import { UserWallet } from "./user_wallet/models/user_wallet.model";
import { BotModule } from "./bot/bot.module";
import { TelegrafModule } from "nestjs-telegraf";
import { BOT_NAME } from "./app.constants";
import { OrderModule } from "./order/order.module";
import { Order } from "./order/models/order.model";
import { AdminModule } from './admin/admin.module';
import { Admin } from "./admin/models/admin.model";
import { AuthModule } from './auth/auth.module';
import { Bot } from "./bot/models/bot.model";
import { Address } from "./bot/models/address.model";
import { Car } from "./bot/models/car.model";
import { OtpModule } from './otp/otp.module';
import { Otp } from "./otp/models/otp.model";
import { OwnerModule } from './owner/owner.module';
import { Owner } from "./owner/models/owner.model";
import { StadiumModule } from './stadium/stadium.module';
import { Stadium } from "./stadium/models/stadium.model";
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN,
        include: [BotModule],
        middlewares: [],
      }),
    }),
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process.env.BOT_TOKEN2,
      }),
    }),
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "static"),
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        Comfort,
        Region,
        District,
        Categories,
        User,
        UserCard,
        UserWallet,
        Order,
        Admin,
        Bot,
        Address,
        Car,
        Otp,
        Owner,
        Stadium
      ],
      autoLoadModels: true,
      sync: { alter: true }, //force
      logging: false,
    }),
    ComfortModule,
    RegionModule,
    DistrictModule,
    CategoriesModule,
    UsersModule,
    MailModule,
    UserCardsModule,
    UserWalletModule,
    BotModule,
    OrderModule,
    AdminModule,
    AuthModule,
    OtpModule,
    OwnerModule,
    StadiumModule,
    SmsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
