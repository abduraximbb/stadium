import { Injectable } from '@nestjs/common';
import { CreateUserWalletDto } from './dto/create-user_wallet.dto';
import { UpdateUserWalletDto } from './dto/update-user_wallet.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UserWallet } from './models/user_wallet.model';

@Injectable()
export class UserWalletService {
  constructor(@InjectModel(UserWallet) private userWalletmodel:typeof UserWallet){}

  create(createUserWalletDto: CreateUserWalletDto) {
    return this.userWalletmodel.create(createUserWalletDto);
  }

  findAll() {
    return this.userWalletmodel.findAll({include:{all:true}});
  }

  findOne(id: number) {
    return this.userWalletmodel.findOne({where:{id}, include:{all:true}});
  }

  async update(id: number, updateUserWalletDto: UpdateUserWalletDto) {
    const user_wallet = await this.userWalletmodel.update(updateUserWalletDto, {where:{id}, returning:true})
    return user_wallet[1][0];
  }

  remove(id: number) {
    return this.userWalletmodel.destroy({where:{id}});
  }
}
