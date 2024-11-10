import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectModel } from '@nestjs/sequelize';
import { District } from './models/district.model';

@Injectable()
export class DistrictService {
  constructor(@InjectModel(District) private districtModel:typeof District){}

  create(createDistrictDto: CreateDistrictDto) {
    return this.districtModel.create(createDistrictDto);
  }

  findAll() {
    return this.districtModel.findAll({include:{all:true}});
  }

  findOne(id: number) {
    return this.districtModel.findOne({where:{id}, include:{all:true}});
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    const district = await this.districtModel.update(updateDistrictDto, {where:{id}, returning:true})
    return district[1][0];
  }

  remove(id: number) {
    return this.districtModel.destroy({where:{id}});
  }
}
