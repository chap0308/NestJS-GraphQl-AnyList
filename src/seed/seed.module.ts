import { ListsModule } from './../lists/lists.module';
import { ListItemModule } from './../list-item/list-item.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ItemsModule } from './../items/items.module';
import { UsersModule } from './../users/users.module';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,//*para poder usar las variables de entorno en nuestros servicios, controladores o resolvers
    //? para usar sus exportaciones de cada modulo
    ItemsModule,
    ListItemModule,
    ListsModule,
    UsersModule,
  ]
})
export class SeedModule {}
