import { Injectable } from '@nestjs/common';
import { CreateStadiumDto } from './dto/create-stadium.dto';
import { UpdateStadiumDto } from './dto/update-stadium.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Stadium } from './models/stadium.model';

@Injectable()
export class StadiumService {
  constructor(@InjectModel(Stadium) private stadiumModel:typeof Stadium){}

  create(createStadiumDto: CreateStadiumDto) {
    return this.stadiumModel.create(createStadiumDto);
  }

  findAll() {
    return this.stadiumModel.findAll({include:{all:true}});
  }

  findOne(id: number) {
    return this.stadiumModel.findOne({where:{id}, include:{all:true}});
  }

  async update(id: number, updateStadiumDto: UpdateStadiumDto) {
    const stadium = await this.stadiumModel.update(updateStadiumDto, {where:{id}, returning:true})
    return stadium[1][0];
  }

  remove(id: number) {
    return this.stadiumModel.destroy({where:{id}});
  }
}
