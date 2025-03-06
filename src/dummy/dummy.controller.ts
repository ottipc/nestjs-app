import { Controller, Post, Get, Body, Query, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DummyService } from './dummy.service';
import { LoginDto } from './dto/login.dto';
import { OrderDto } from './dto/order.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('dummy')
@Controller('dummy')
export class DummyController {
  constructor(private readonly dummyService: DummyService) {}

  @Post('auth')
  async getAuthToken(@Body() loginDto: LoginDto) {
    return this.dummyService.getAuthToken(loginDto);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('products')
  async getProducts(@Query('sort') sort?: string, @Query('filter') filter?: string) {
    return this.dummyService.getProducts(sort, filter);
  }

  @Post('order')
  async processOrder(@Body() orderDto: OrderDto) {
    return this.dummyService.processOrder(orderDto.products);
  }

  @Post('user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.dummyService.createUser(createUserDto);
  }
}
