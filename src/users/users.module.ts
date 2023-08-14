import { ListsModule } from './../lists/lists.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ItemsModule } from './../items/items.module';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    
    TypeOrmModule.forFeature([ User ]),//*para la base de datos
    ItemsModule,
    ListsModule
  ],
  //* por defecto los dtos y types se pueden usar sin la necesidad de ser exportardos
  exports: [
    UsersService,//* pero los controllers o services sí necesitan ser exportados
    TypeOrmModule,//* en caso de que alguien quiere usar los entities de esta carpeta o inyectar el Respository de nuestras entidades.
  ]
})
export class UsersModule {}
