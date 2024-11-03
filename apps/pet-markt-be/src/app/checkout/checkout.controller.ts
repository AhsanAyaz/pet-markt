import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpRedirectResponse,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import type { Response } from 'express';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async create(@Body() createCheckoutDto: CreateCheckoutDto) {
    const session = await this.checkoutService.create(createCheckoutDto);
    const resp: HttpRedirectResponse = {
      url: session.url,
      statusCode: 303,
    };

    return resp;
  }

  @Get()
  findAll() {
    return this.checkoutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkoutService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCheckoutDto: UpdateCheckoutDto
  ) {
    return this.checkoutService.update(+id, updateCheckoutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkoutService.remove(+id);
  }
}
