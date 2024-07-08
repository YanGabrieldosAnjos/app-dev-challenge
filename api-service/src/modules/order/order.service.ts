import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client/edge';
import { OrderInputDto } from './dto/orderInput.dto';


@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async createOrder(dto: OrderInputDto) {
    try {
      const order: Prisma.OrderCreateInput =  {
        orderId: dto.numeroPedido.split("-")[0],
        value: dto.valorTotal,
        creationDate: new Date(dto.dataCriacao).toISOString(),
        products: {
          createMany: {
            data: dto.items.map(item => {
              return {
                productId: item.idItem,
                quantity: item.quantidadeItem,
                price: item.valorItem
              }
            })
          }
        }
      };
      return this.prisma.order.create({
        data: {
          ...order,
        }
      }).catch((_) =>  {  throw new HttpException("Can't insert this order.", HttpStatus.CONFLICT)})
    } catch (error) {
      
      throw error
    }
  }
    
  async getOrder(orderId: string) {
    return this.prisma.order.findUnique({
      where: {
        orderId,
      },
      include: {
        products: true,
      }
    })
  }

  async listOrder() {
    return this.prisma.order.findMany({
      include: {
        products: true,
      }
    })
  }

  async updateOrder(dto: OrderInputDto) {
    const where: Prisma.OrderWhereUniqueInput = {
      orderId: dto.numeroPedido.split("-")[0],
    }
    const data: Prisma.OrderUpdateInput = {
      orderId: where.orderId,
      value: dto.valorTotal,
      creationDate: new Date(dto.dataCriacao).toISOString(),
    }

    const {products} = await this.prisma.order.findUnique({where, include: {products: true}});
    const { 
      productsToUpdate, 
      productsToInsert 
    }: {
      productsToUpdate: Prisma.ProductCreateInput[], 
      productsToInsert: Prisma.ProductCreateInput[] 
    } = dto.items.reduce((acc, item) => {
      const product: Prisma.ProductCreateInput = {
        productId: item.idItem,
        quantity: item.quantidadeItem,
        price: item.valorItem,
        order: {
          connect: {
            orderId: where.orderId,
          }
        }
      }

      if (products.some(prd => prd.productId === product.productId)) {
        acc.productsToUpdate.push(product);
      } else {
        acc.productsToInsert.push(product);
      }
      return acc;
    }, { productsToUpdate: [], productsToInsert: [] });
    return this.prisma.$transaction([
      this.prisma.product.createMany({
        data: productsToInsert.map(prod => {
          delete prod.order;
          return {
            ...prod,
            orderId: where.orderId,
          }
        }),
      }),
      ...productsToUpdate.map(prod => this.prisma.product.update({data: prod, where: {productId: prod.productId} })),
      this.prisma.order.update({where, data})
    ])
  }

  async deleteOrder(orderId: string) {
    return this.prisma.order.delete({
      where: {
        orderId,
      }
    })
  }
    
}
