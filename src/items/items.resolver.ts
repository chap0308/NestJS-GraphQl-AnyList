import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

import { ItemsService } from './items.service';

import { Item } from './entities/item.entity';
import { User } from './../users/entities/user.entity';

import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { PaginationArgs, SearchArgs } from './../common/dto/args';

import { CurrentUser } from '../auth/decorators/current-user.decorator';


@Resolver(() => Item)
@UseGuards( JwtAuthGuard )//*ESTO ES PARA VALIDAR QUE EL USUARIO ESTÉ AUTENTICADO, YA QUE PARA USAR ESTOS ENDPOINTS TIENE QUE TENER UNA CUENTA
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User//*obtenemos el usuario conectado
  ): Promise<Item> {
    return this.itemsService.create( createItemInput, user );
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(//! solo muestra los items que le pertenecen al usuario
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,//! acá usamos multiples args (comentar forbidNonWhitelisted: true en main.ts)
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {

    return this.itemsService.findAll( user, paginationArgs, searchArgs );
  }

  @Query(() => Item, { name: 'item' })
  async findOne(//! solo muestra los items que le pertenecen al usuario
    //* el nombre del argumento "id" es lo que vale en apollo
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,//*Nota: tambien se puede usar ParseUUIDPipe, esto generará un error especifico si no se manda un "uuid" en apollo
    @CurrentUser() user: User
  ): Promise<Item> {//? Importante tipar el tipo de dato que devuelve la funcion
    return this.itemsService.findOne(id, user );
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User
  ):Promise<Item> {
    return this.itemsService.update( updateItemInput.id, updateItemInput, user );
  }

  @Mutation(() => Item)
  removeItem(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemsService.remove(id, user);
  }
}
