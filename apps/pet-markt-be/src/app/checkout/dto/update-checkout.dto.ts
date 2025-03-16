import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckoutDto } from './create-checkout.dto';

export class UpdateCheckoutDto extends PartialType(CreateCheckoutDto) {}
