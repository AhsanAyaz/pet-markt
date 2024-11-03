import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';

const stripe = require('stripe')(process.env['STRIPE_SECRET']);

@Injectable()
export class CheckoutService {
  async create(createCheckoutDto: CreateCheckoutDto) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:4200/checkout/success',
      cancel_url: 'http://localhost:4200/checkout/cancel',
    });

    return session;
  }

  findAll() {
    return `This action returns all checkout`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkout`;
  }

  update(id: number, updateCheckoutDto: UpdateCheckoutDto) {
    return `This action updates a #${id} checkout`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkout`;
  }
}
