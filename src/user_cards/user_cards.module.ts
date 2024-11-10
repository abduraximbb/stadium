import { Module } from '@nestjs/common';
import { UserCardsService } from './user_cards.service';
import { UserCardsController } from './user_cards.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserCard } from './models/user_card.model';

@Module({
  imports:[SequelizeModule.forFeature([UserCard])],
  controllers: [UserCardsController],
  providers: [UserCardsService],
})
export class UserCardsModule {}
