import { Injectable } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Owner } from './models/owner.model';

@Injectable()
export class OwnerService {
  constructor(@InjectModel(Owner) private ownerModel:typeof Owner){}

  create(createOwnerDto: CreateOwnerDto) {
    return this.ownerModel.create(createOwnerDto);
  }

  findAll() {
    return this.ownerModel.findAll({include:{all:true}});
  }

  findOne(id: number) {
    return this.ownerModel.findOne({where:{id}, include:{all:true}});
  }

  async update(id: number, updateOwnerDto: UpdateOwnerDto) {
    const owner = await this.ownerModel.update(updateOwnerDto,{where:{id}, returning:true})
    return owner[1][0];
  }

  remove(id: number) {
    return this.ownerModel.destroy({where:{id}});
  }
}
