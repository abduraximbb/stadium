import { Injectable } from '@nestjs/common';
import { CreateComfortDto } from './dto/create-comfort.dto';
import { UpdateComfortDto } from './dto/update-comfort.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Comfort } from './models/comfort.model';

@Injectable()
export class ComfortService {
  constructor(@InjectModel(Comfort) private comfortModel:typeof Comfort){}


  create(createComfortDto: CreateComfortDto) {
    return this.comfortModel.create(createComfortDto);
  }

  findAll() {
    return this.comfortModel.findAll({include:{all:true}});
  }

  findOne(id: number) {
    return this.comfortModel.findOne({where:{id}, include:{all:true}});
  }

  async update(id: number, updateComfortDto: UpdateComfortDto) {
    const comfort = await this.comfortModel.update(updateComfortDto, {where:{id}, returning:true})
    return comfort[1][0];
  }

  remove(id: number) {
    return this.comfortModel.destroy({where:{id}});
  }
}
