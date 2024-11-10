import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { BotService } from "./bot.service";

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    await this.botService.onContact(ctx);
  }

  @Command("stop")
  async onStop(@Ctx() ctx: Context) {
    await this.botService.onStop(ctx);
  }

  @Command("address")
  async onAddress(@Ctx() ctx: Context) {
    await this.botService.onAddress(ctx);
  }

  @Hears("Yangi manzil qo'shish")
  async addNewAddress(@Ctx() ctx: Context) {
    await this.botService.addNewAddress(ctx);
  }

  @Hears("Mening manzillarim")
  async showAddresses(@Ctx() ctx: Context) {
    await this.botService.showAddresses(ctx);
  }

  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    if ("location" in ctx.message) {
      await this.botService.onLocation(ctx);
    }
  }

  @Action(/location_+[1-9]/)
  async onClickLocation(@Ctx() ctx: Context) {
    await this.botService.onClickLocation(ctx);
  }

  @Command("car")
  async onCar(@Ctx() ctx: Context) {
    await this.botService.onCar(ctx);
  }

  @Hears("Yangi avtomobil qo'shish")
  async addNewCar(@Ctx() ctx: Context) {
    await this.botService.addNewCar(ctx);
  }

  @Hears("Mening avtomobillarim")
  async showCars(@Ctx() ctx: Context) {
    await this.botService.showCars(ctx);
  }

  @Command("search")
  async searchLoaction(@Ctx() ctx: Context) {
    await this.botService.searchLoaction(ctx);
  }

  @On("text")
  async onText(@Ctx() ctx: Context) {
    await this.botService.onText(ctx);
  }

  // @On("photo")
  // async onPhot0(@Ctx() ctx: Context) {
  //   console.log(ctx);

  //   if ("photo" in ctx.message) {
  //     console.log(ctx.message.photo);

  //     await ctx.replyWithPhoto(
  //       String(ctx.message.photo[ctx.message.photo.length - 1].file_id)
  //     );
  //   }
  // }

  // @On("video")
  // async onVideo(@Ctx() ctx: Context) {
  //   console.log(ctx);

  //   if ("video" in ctx.message) {
  //     console.log(ctx.message.video);

  //     await ctx.reply(String(ctx.message.video.file_name));
  //   }
  // }

  // // @On("sticker")
  // async onSticker(@Ctx() ctx: Context) {
  //   console.log(ctx);

  //   if ("sticker" in ctx.message) {
  //     console.log(ctx.message.sticker);

  //     await ctx.reply("💋");
  //   }
  // }

  // @On("animation")
  // async onAnimation(@Ctx() ctx: Context) {
  //   console.log(ctx);

  //   if ("animation" in ctx.message) {
  //     console.log(ctx.message.animation);

  //     await ctx.reply(String(ctx.message.animation.duration));
  //   }
  // // }
  // }

  //     await ctx.reply(String(ctx.message.location.latitude));
  //     await ctx.reply(String(ctx.message.location.longitude));
  //     await ctx.replyWithLocation(
  //       ctx.message.location.latitude,
  //       ctx.message.location.longitude
  //     );
  //   }
  // }

  // @On("voice")
  // async onVoice(@Ctx() ctx: Context) {
  //   if ("voice" in ctx.message) {
  //     console.log(ctx.message.voice);

  //     await ctx.reply(String(ctx.message.voice.duration));
  //   }
  // }

  // @On("invoice")
  // async onInvoice(@Ctx() ctx: Context) {
  //   if ("invoice" in ctx.message) {
  //     console.log(ctx.message.invoice);

  //     await ctx.reply(String(ctx.message.invoice.title));
  //   }
  // }

  // @On("document")
  // async onDocument(@Ctx() ctx: Context) {
  //   if ("document" in ctx.message) {
  //     console.log(ctx.message.document);

  //     await ctx.reply(String(ctx.message.document.file_name));
  //   }
  // }

  // @Hears("hi")
  // async hearsHi(@Ctx() ctx: Context) {
  //   await ctx.reply("Hi barbie");
  // }

  // @Command("help")
  // async commandHelp(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML(`<b>start</b> - Botni ishga tushirish,\n<b>stop</b> - Botni to'xtashishi,\n<b>help</b> - Ushbu buyruqlarni ko'rsatish,
  //       `);
  // }

  // @Command("inline")
  // async inlineButtons(@Ctx() ctx: Context) {
  //   const inlineKeyboard = [
  //     [
  //       {
  //         text: "Button1",
  //         callback_data: "button_1",
  //       },
  //       {
  //         text: "Button2",
  //         callback_data: "button_2",
  //       },
  //       {
  //         text: "Button3",
  //         callback_data: "button_3",
  //       },
  //     ],
  //     [
  //       {
  //         text: "Button4",
  //         callback_data: "button_4",
  //       },
  //       {
  //         text: "Button5",
  //         callback_data: "button_5",
  //       },
  //     ],
  //     [
  //       {
  //         text: "Button6",
  //         callback_data: "button_6",
  //       },
  //     ],
  //   ];
  //   await ctx.reply("Kerakli inline buttonni tanla:", {
  //     reply_markup: {
  //       inline_keyboard: inlineKeyboard,
  //     },
  //   });
  // }

  // @Action("button1")
  // async onClickButton1(@Ctx() ctx: Context) {
  //   await ctx.reply("Button1 tugmasi bosildi");
  // }

  // @Action("button2")
  // async onClickButton2(@Ctx() ctx: Context) {
  //   await ctx.reply("Button2 tugmasi bosildi");
  // }

  // @Action(/button_+[1-9]/)
  // async onClickAnyButton(@Ctx() ctx: Context) {
  //   const actText = ctx.callbackQuery["data"]
  //   const button_id = Number(actText.split("_")[1])
  //   await ctx.reply(`${button_id} tugmasi bosildi`);
  // }

  // @Command("main")
  // async mainButtons(@Ctx() ctx: Context) {
  //   await ctx.reply("Kerakli Main buttonni tanla:", {
  //     parse_mode: "HTML",
  //     ...Markup.keyboard([
  //       ["bir", "ikki", "uch"],
  //       ["to'rt", "besh"],
  //       ["olti"],
  //       [Markup.button.contactRequest("📞 Telefon raqamni yuboring")],
  //       [Markup.button.locationRequest("📍 Lokatsiyani yuboring")],
  //     ]).resize(),
  //     // .oneTime(),
  //   });
  // }

  // @Hears("bir")
  // async onBirButtonClick(@Ctx() ctx: Context) {
  //   await ctx.reply("Bir tugmasi bosildi");
  // }

  // @On("text")
  // async onText(@Ctx() ctx: Context) {
  //   console.log(ctx);

  //   if ("text" in ctx.message) {
  //     if (ctx.message.text == "salom") {
  //       await ctx.replyWithHTML("<b> HELLO✋🏿 </b>");
  //     } else {
  //       await ctx.replyWithHTML(ctx.message.text);
  //     }
  //   }
  // }

  // @On("message")
  // async onMessage(@Ctx() ctx: Context) {
  //   console.log(ctx.botInfo);
  //   console.log(ctx.chat);
  //   console.log(ctx.chat.id);
  //   console.log(ctx.from);
  //   console.log(ctx.from.first_name);
  // }
}
