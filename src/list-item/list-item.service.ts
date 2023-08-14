import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { List } from './../lists/entities/list.entity';
import { ListItem } from './entities/list-item.entity';

import { PaginationArgs, SearchArgs } from './../common/dto/args';

import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';

@Injectable()
export class ListItemService {

  constructor(
    
    @InjectRepository( ListItem )
    private readonly listItemsRepository: Repository<ListItem>,

  ) {}


  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {

    const { itemId, listId, ...rest } = createListItemInput;

    //todo: hacer validacion de que el item exista en la base de datos

    let newListItem: ListItem;

    for (const item of itemId ) {
      newListItem = this.listItemsRepository.create({
        ...rest,
        //! Esta es la forma para guardar en una tabla pivote:
        item: { id: item },
        list: { id: listId }
      });

      await this.listItemsRepository.save( newListItem );//*esperamos a que se guarde
    }
    // const newListItem = this.listItemsRepository.create({
    //   ...rest,
    //   //! Esta es la forma para guardar en una tabla pivote:
    //   item: { id: itemId },
    //   list: { id: listId }
    // });
    
    return this.findOne( newListItem.id );//*y despues volvemos a hacer la consulta con el findOne para verlo en el response completamente
  }

  async findAll( list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<ListItem[]> {

    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    
    const queryBuilder = this.listItemsRepository.createQueryBuilder('listItem') // <-- Nombre para las relaciones
      .innerJoin('listItem.item','item') // <--- Lo añadí después, fue un problema que no grabé
      .take( limit )
      .skip( offset )
      .where(`"listId" = :listId`, { listId: list.id });

    if ( search ) {
      queryBuilder.andWhere('LOWER(item.name) like :name', { name: `%${ search.toLowerCase() }%` });
    }

    return queryBuilder.getMany();

  }

  async countListItemsByList( list: List ): Promise<number> {
    return this.listItemsRepository.count({
      where: { 
        //! forma de como contar cuantos listItems tiene cada lista
        list: { id: list.id }
      }
    });
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({ id });

    if ( !listItem ) throw new NotFoundException(`List item with id ${ id } not found`);

    return listItem;
  }

  async update(
    id: string, updateListItemInput: UpdateListItemInput
  ): Promise<ListItem> {

    const { listId, itemId, ...rest } = updateListItemInput;
    
    // const queryBuilder = this.listItemsRepository.createQueryBuilder()
    //   .update()
    //   .set( rest )
    //   .where('id = :id', { id });
    //! error: solo actualiza uno o listId o itemId
    // if ( listId ) queryBuilder.set({ list: { id: listId } });
    // if ( itemId ) queryBuilder.set({ item: { id: itemId } });

    // const queryBuilder = this.listItemsRepository
    //   .createQueryBuilder()
    //   .update()
    //   .set({
    //     ...rest,
    //     ...(listId && { list: { id: listId } }),
    //     ...(itemId && { item: { id: itemId } }),
    //   })
    //   .where('id = :id', { id })

      let queryBuilder;

      for (const variableItem of itemId ) {//*solo es uno así que no es necesario hacerlo de esta manera, solo una vez va a iterar
        queryBuilder = this.listItemsRepository
          .createQueryBuilder()
          .update()
          .set({
            ...rest,
            ...(listId && { list: { id: listId } }),
            ...(variableItem && { item: { id: variableItem } }),
          })
          .where('id = :id', { id })

          await queryBuilder.execute();//*el execute no devuelve una instancia, solo cuantas filas o columnas fueron actualizadas (simple informacion).
          //* dato: el execute() a comparacion del .create, .findOne, .update o .preload, no devuelve una instancia. Los otros sí.
      }
    
    //? no usamos el getMany() porque solo esperamos un valor(no un array) de la tabla detalle
    

    return this.findOne( id );//*por eso usamos el findOne para mostrar los datos al momento de ejecutarse

  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
