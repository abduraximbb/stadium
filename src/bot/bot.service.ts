import { Injectable } from "@nestjs/common";
import { CreateBotDto } from "./dto/create-bot.dto";
import { UpdateBotDto } from "./dto/update-bot.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Address } from "./models/address.model";
import { Car } from "./models/car.model";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private botModel: typeof Bot,
    @InjectModel(Address) private addressModel: typeof Address,
    @InjectModel(Car) private carModel: typeof Car,
    @InjectBot(BOT_NAME) private bot: Telegraf<Context>
  ) {}

  async start(ctx: Context) {
    const userId = ctx.from.id;
    const user = await this.botModel.findByPk(userId);
    if (!user) {
      await this.botModel.create({
        user_id: userId,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        lang: ctx.from.language_code,
      });

      await ctx.reply(
        `Iltimos, <b>"📞 Telefon raqamni yuboring"</b> tugmasini bosing`,
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("📞 Telefon raqamni yuboring")],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else if (!user.status) {
      await ctx.reply(
        `Iltimos, <b>"📞 Telefon raqamni yuboring"</b> tugmasini bosing`,
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("📞 Telefon raqamni yuboring")],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else {
      await ctx.reply(
        `Bu bot stadion egalarini faollashtirsh uchun ishlatiladi`,
        {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        }
      );
    }
  }

  async onContact(ctx: Context) {
    if ("contact" in ctx.message) {
      const userId = ctx.from.id;
      const user = await this.botModel.findByPk(userId);
      if (!user) {
        await ctx.reply(`Iltimos Start tugmasini bosing`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]])
            .resize()
            .oneTime(),
        });
      } else if (ctx.message.contact.user_id != userId) {
        await ctx.reply(`Iltimos, o'zingizni telefon raqamingizni yuboring`, {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("📞 Telefon raqamni yuboring")],
          ])
            .resize()
            .oneTime(),
        });
      } else {
        await this.botModel.update(
          {
            phone_number: ctx.message.contact.phone_number,
            status: true,
          },
          {
            where: { user_id: userId },
          }
        );
        await ctx.reply(`Tabriklayman, siz faollashtirildingiz`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        });
      }
    }
  }

  async onStop(ctx: Context) {
    const userId = ctx.from.id;
    const user = await this.botModel.findByPk(userId);
    if (!user) {
      await ctx.reply(`Siz avval ro'yxatdan o'tmagansiz.`, {
        parse_mode: "HTML",
        ...Markup.keyboard([["/start"]])
          .resize()
          .oneTime(),
      });
    } else if (user.status) {
      await this.botModel.update(
        {
          status: false,
          phone_number: null,
        },
        {
          where: { user_id: userId },
        }
      );

      await ctx.reply(`Siz Botdan chiqdingiz`, {
        parse_mode: "HTML",
        ...Markup.removeKeyboard(),
      });
    } else {
      await this.bot.telegram.sendChatAction(user.user_id, "typing");

      await ctx.reply(`Siz Botdan allaqchon chiqgansiz`, {
        parse_mode: "HTML",
        ...Markup.removeKeyboard(),
      });
    }
  }

  async onAddress(ctx: Context) {
    await ctx.reply(`Manzillarim`, {
      parse_mode: "HTML",
      ...Markup.keyboard([
        ["Mening manzillarim", "Yangi manzil qo'shish"],
      ]).resize(),
    });
  }

  async addNewAddress(ctx: Context) {
    const userId = ctx.from.id;
    const user = await this.botModel.findByPk(userId);
    if (!user) {
      await ctx.reply(`Siz avval ro'yxatdan o'tmagansiz.`, {
        parse_mode: "HTML",
        ...Markup.keyboard([["/start"]])
          .resize()
          .oneTime(),
      });
    } else {
      await this.addressModel.create({
        user_id: userId,
        last_state: "address_name",
      });
      await ctx.reply(`Manzil nomini kiriting: `, {
        parse_mode: "HTML",
        ...Markup.removeKeyboard(),
      });
    }
  }

  async onText(ctx: Context) {
    if ("text" in ctx.message) {
      const userId = ctx.from.id;
      const user = await this.botModel.findByPk(userId);
      if (!user) {
        await ctx.reply(`Siz avval ro'yxatdan o'tmagansiz.`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]])
            .resize()
            .oneTime(),
        });
      } else {
        const address = await this.addressModel.findOne({
          where: { user_id: userId },
          order: [["id", "desc"]],
        });
        if (address && address.last_state !== "finish") {
          if (address.last_state == "address_name") {
            address.address_name = ctx.message.text;
            address.last_state = "address";
            await address.save();
            await ctx.reply(`Manzilni kiriting: `, {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
          } else if (address.last_state == "address") {
            address.address = ctx.message.text;
            address.last_state = "location";
            await address.save();
            await ctx.reply(`Manzilinginz lokatsiyasini kiriting: `, {
              parse_mode: "HTML",
              ...Markup.keyboard([
                [Markup.button.locationRequest("lokatsiyani yuborish")],
              ]).resize(),
            });
          }
        }

        const car = await this.carModel.findOne({
          where: { user_id: userId },
          order: [["id", "desc"]],
        });
        if (car) {
          if (car.last_state == "car_number") {
            car.car_number = ctx.message.text;
            car.last_state = "model";
            await car.save();

            await ctx.reply(`Modelini kiriting 🚘`, {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
          } else if (car.last_state == "model") {
            car.model = ctx.message.text;
            car.last_state = "color";
            await car.save();

            await ctx.reply(`Rangini kiriting 🔴⚫️`, {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
          } else if (car.last_state == "color") {
            car.color = ctx.message.text;
            car.last_state = "year";
            await car.save();

            await ctx.reply(`Yilini kiriting 🔖`, {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
          } else if (car.last_state == "year") {
            car.year = +ctx.message.text;
            car.last_state = "finish";
            await car.save();

            await ctx.reply(`Avtomobilingiz muvaffaqiyatli qo'shildi`, {
              parse_mode: "HTML",
              ...Markup.keyboard([
                ["Mening avtomobillarim", "Yangi avtomobil qo'shish"],
              ]).resize(),
            });
          }
        }
      }
    }
  }

  async onLocation(ctx: Context) {
    if ("location" in ctx.message) {      
      const userId = ctx.from.id;
      const user = await this.botModel.findByPk(userId);

      if (!user) {
        await ctx.reply(`Siz avval ro'yxatdan o'tmagansiz.`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]])
            .resize()
            .oneTime(),
        });
      } else {
        const address = await this.addressModel.findOne({
          where: { user_id: userId },
          order: [["id", "desc"]],
        });
        if (address) {
          if (address.last_state == "location") {
            address.location = `${ctx.message.location.latitude}, ${ctx.message.location.longitude}`;
            address.last_state = "finish";
            await address.save();
            await ctx.reply(`Manzilingiz qo'shildi`, {
              parse_mode: "HTML",
              ...Markup.keyboard([
                ["Mening manzillarim", "Yangi manzil qo'shish"],
              ]).resize(),
            });
          }
        }
      }
    }
  }

  async showAddresses(ctx: Context) {
    const userId = ctx.from.id;
    const user = await this.botModel.findByPk(userId);
    if (!user) {
      await ctx.reply(`Siz avval ro'yxatdan o'tmagansiz.`, {
        parse_mode: "HTML",
        ...Markup.keyboard([["/start"]])
          .resize()
          .oneTime(),
      });
    } else {
      const addresses = await this.addressModel.findAll({
        where: { user_id: userId },
      });
      if (addresses) {
        addresses.forEach(async (address) => {
          await ctx.replyWithHTML(
            `<b>Manzil nomi:</b> ${address.address_name}\n<b>Manzil:</b> ${address.address}`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Lokatsiyani ko'rish",
                      callback_data: `location_${address.id}`,
                    },
                  ],
                ],
              },
            }
          );
        });
      }
    }
  }

  async onClickLocation(ctx: Context) {
    try {
      const actText = ctx.callbackQuery["data"];
      const address_id = Number(actText.split("_")[1]);
      const address = await this.addressModel.findByPk(address_id);
      await ctx.replyWithLocation(
        Number(address.location.split(",")[0]),
        Number(address.location.split(",")[1])
      );
    } catch (error) {
      console.log("onClickLocation", error);
    }
  }

  //==================CARS===================//
  async onCar(ctx: Context) {
    await ctx.reply(`Avtomobillarim`, {
      parse_mode: "HTML",
      ...Markup.keyboard([
        ["Mening avtomobillarim", "Yangi avtomobil qo'shish"],
      ]).resize(),
    });
  }

  async addNewCar(ctx: Context) {
    const userId = ctx.from.id;
    const user = this.botModel.findByPk(userId);
    if (!user) {
      await ctx.reply(`Siz avval ro'yxatdan o'tmagansiz`, {
        parse_mode: "HTML",
        ...Markup.keyboard([["/start"]])
          .resize()
          .oneTime(),
      });
    } else {
      this.carModel.create({
        user_id: userId,
        last_state: "car_number",
      });

      await ctx.reply("Avtomobil raqamini kiriting 🔢", {
        parse_mode: "HTML",
        ...Markup.removeKeyboard(),
      });
    }
  }

  async showCars(ctx: Context) {
    const userId = ctx.from.id;
    const user = this.botModel.findByPk(userId);
    if (!user) {
      await ctx.reply("Siz avval ro'yxatdan o'tmagansiz", {
        parse_mode: "HTML",
        ...Markup.keyboard([["/start"]])
          .resize()
          .oneTime(),
      });
    } else {
      const cars = await this.carModel.findAll({
        where: { user_id: userId },
      });
      if (cars) {
        cars.forEach(async (car) => {
          await ctx.replyWithHTML(
            `<b>Avtomobil raqami:</b> ${car.car_number}\n<b>Avtomobil modeli:</b> ${car.model}\n<b>Avtomobil rangi:</b> ${car.color}\n<b>Avtomobil yili:</b> ${car.year}`
          );
        });
      }
    }
  }

  async sendOtp(phone_number: string, OTP: string): Promise<boolean> {
    const user = await this.botModel.findOne({ where: { phone_number } });

    if (!user || !user.status) {
      return false;
    }

    await this.bot.telegram.sendChatAction(user.user_id, "typing");

    await this.bot.telegram.sendMessage(user.user_id, "Verify OTP code:" + OTP);
    return true;
  }

  async searchLoaction(ctx:Context){
     await ctx.reply(`Turgan manzilingiz lokatsiyasini kiriting: `, {
       parse_mode: "HTML",
       ...Markup.keyboard([
         [Markup.button.locationRequest("lokatsiyani jo'natish 📍")],
       ]).resize(),
     });
  }
}
