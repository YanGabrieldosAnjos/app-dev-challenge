import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/roles/roles.guard';
import {  OrderInputDto } from './dto/orderInput.dto';

@ApiBearerAuth()
@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    private orderService: OrderService,
  ) {}

  @Roles('user', 'admin')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Create Order' })
  @ApiResponse({
    status: 201,
    description: 'Created Record',
  })
  @Post()
  async createOrder(@Body() dto: OrderInputDto) {
    return this.orderService.createOrder(dto);
  }

  @Roles('user', 'admin')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Get Order' })
  @ApiResponse({
    status: 200,
    description: 'Got Record',
  })
  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrder(orderId);
  }

  @Roles('user', 'admin')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Get Order' })
  @ApiResponse({
    status: 200,
    description: 'Got Record',
  })
  @Get()
  async list(orderId: string) {
    return this.orderService.listOrder();
  }

  @Roles('user', 'admin')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Update Order' })
  @ApiResponse({
    status: 200,
    description: 'Update Record',
  })
  @Put()
  async putOrder(@Body() dto: OrderInputDto) {
    return this.orderService.updateOrder(dto);
  }

  @Roles('user', 'admin')
  @UseGuards(AuthGuard, RoleGuard)  
  @ApiOperation({ summary: 'Delete Order' })
  @ApiResponse({
    status: 204,
    description: 'Delete Record',
  })
  @Delete(':orderId')
  async deleteOrder(@Param('orderId') orderId: string) {
    return this.orderService.deleteOrder(orderId);
  }
}
