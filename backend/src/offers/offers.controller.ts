import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JwtUserData } from 'src/auth/strategy/jwt.strategy';

import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(
    @Req() req: Request & { user: JwtUserData },
    @Body() createOfferData: CreateOfferDto,
  ) {
    return this.offersService.create(createOfferData, req.user.userId);
  }

  @Get()
  async findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: Offer['id']) {
    return this.offersService.findOne(id);
  }
}
