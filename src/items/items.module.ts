import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { Item } from './entities/item.entity';

@Module({
  providers: [
    ItemsResolver, 
    ItemsService
  ],
  imports: [
    
    TypeOrmModule.forFeature([Item])//*importante para la base de datos:
  ],
  exports: [
    ItemsService,
    TypeOrmModule,//* en caso de que alguien quiere usar los entities de esta carpeta o inyectar el Respository de nuestras entidades.
  ]
})
export class ItemsModule {}
