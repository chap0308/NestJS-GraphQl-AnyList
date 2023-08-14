import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';

import { ListItemModule } from './../list-item/list-item.module';

import { List } from './entities/list.entity';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [
    TypeOrmModule.forFeature([ List ]),
    ListItemModule,//* obtenemos todo lo que se exporta de su modulo
  ],
  exports: [
    //*exportarlos para usarlos en el seed
    TypeOrmModule,
    ListsService,    
  ]
})
export class ListsModule {}
