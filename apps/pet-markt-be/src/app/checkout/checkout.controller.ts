import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async create(@Body() createCheckoutDto: CreateCheckoutDto) {
    const session = await this.checkoutService.create(createCheckoutDto);
    if (!session.url) {
      throw new HttpException('Could not create a checkout session', 400);
    }

    return {
      url: session.url,
    };
  }
}
