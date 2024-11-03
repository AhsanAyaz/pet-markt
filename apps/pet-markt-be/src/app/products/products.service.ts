import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { productsList } from './productsList';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = productsList;

  create(createProductInput: CreateProductInput) {
    const newProduct = { ...createProductInput, id: this.products.length + 1 };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products.find((product) => product.id === id);
  }

  update(id: number, updateProductInput: UpdateProductInput) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updateProductInput };
      return this.products[index];
    }
    return null;
  }

  searchProducts(term: string): Product[] {
    const lowercaseTerm = term.toLowerCase();
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseTerm) ||
        product.description.toLowerCase().includes(lowercaseTerm)
    );
  }

  remove(id: number) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      const [removedProduct] = this.products.splice(index, 1);
      return removedProduct;
    }
    return null;
  }
}
