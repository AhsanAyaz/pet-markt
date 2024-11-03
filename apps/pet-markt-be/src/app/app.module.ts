import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductsModule } from './products/products.module';
import { join } from 'path';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/pet-markt-be/src/schema.gql'),
    }),
    ProductsModule,
    CheckoutModule,
  ],
})
export class AppModule {}
