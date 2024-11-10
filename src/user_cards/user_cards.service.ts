import { Injectable } from '@nestjs/common';
import { CreateUserCardDto } from './dto/create-user_card.dto';
import { UpdateUserCardDto } from './dto/update-user_card.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UserCard } from './models/user_card.model';

@Injectable()
export class UserCardsService {
  constructor(@InjectModel(UserCard) private userCardModel:typeof UserCard){}

  create(createUserCardDto: CreateUserCardDto) {
    return this.userCardModel.create(createUserCardDto);
  }

  findAll() {
    return this.userCardModel.findAll({include:{all:true}});
  }

  findOne(id: number) {
    return this.userCardModel.findOne({where:{id}, include:{all:true}});
  }

  async update(id: number, updateUserCardDto: UpdateUserCardDto) {
    const user_card = await this.userCardModel.update(updateUserCardDto, {where:{id}, returning:true})
    return user_card[1][0];
  }

  remove(id: number) {
    return this.userCardModel.destroy({where:{id}});
  }
}
