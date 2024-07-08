import { IsDate, IsNumber, IsString } from "@nestjs/class-validator";

export class ProductInputDto {
  @IsString()
  idItem: string;
  @IsNumber()
  quantidadeItem: number;
  @IsNumber()
  valorItem: number;
}

export class OrderInputDto   {
  @IsString()
  numeroPedido: string;
  @IsNumber()
  valorTotal: number;
  @IsDate()
  dataCriacao: Date;

  items: ProductInputDto[];
  
}

