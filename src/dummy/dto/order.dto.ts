import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductOrderItemDto } from './product-order-item.dto';

export class OrderDto {
  @ApiProperty({ type: [ProductOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderItemDto)
  products!: ProductOrderItemDto[];
}
