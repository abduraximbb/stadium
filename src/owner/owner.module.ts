import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Owner } from './models/owner.model';

@Module({
  imports:[SequelizeModule.forFeature([Owner])],
  controllers: [OwnerController],
  providers: [OwnerService],
})
export class OwnerModule {}
