import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { PaginationArgs, SearchArgs } from './../common/dto/args';

import { User } from './../users/entities/user.entity';
import { Item } from './entities/item.entity';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>,

  ) {}

  async create( createItemInput: CreateItemInput, user: User ): Promise<Item> {

    const newItem = this.itemsRepository.create({ ...createItemInput, user })
    return await this.itemsRepository.save( newItem );
  }

  async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<Item[]> {

    const { limit, offset } = paginationArgs;//*ya vienen con valores por defecto
    const { search } = searchArgs;//*puede venir undefined
    
    const queryBuilder = this.itemsRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where(`"userId" = :userId`, { userId: user.id });//? ":userId" es la variable que asignamos en {userId: user.id}

    if ( search ) {//*si no viene undefined
      //? .andWhere permite seguir la consulta de un queryBuilder
      //! OJO: COLOCAR en comillas la variable de la base de datos, porque sino tambien lo coloca en minuscula. COLOCAR ASÍ: "name". En este caso no importa porque ya es minuscula, pero para otros casos con variables en mayusculas si importan 
      queryBuilder.andWhere('LOWER("name") like :name', { name: `%${ search.toLowerCase() }%` });//? LOWER(name) es de la base de datos, lo demás es la variable que queremos asignar
    }

    return queryBuilder.getMany();//*getMany es para obtener muchos
    
    //? otra manera con find, pero no trae los que tienen mayusculas, falta colocarle a la variable "name" en minuscula, por eso usamos el queryBuilder
    // return this.itemsRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {//*solo muestra los items que le pertenecen al usuario
    //     user: {//! este user es de las variables propias de itemsRepository
    //       id: user.id
    //     },
    //     name: Like(`%${ search.toLowerCase() }%`) 
    //   }
    // });
  }

  async findOne( id: string, user: User ): Promise<Item> {

    const item = await this.itemsRepository.findOneBy({ 
      //*es como si fuera un andwhere, es decir los dos se debe cumplir
      id,
      user: {//! esto se activa cuando se usa @Index('userId-index')
        id: user.id
      }
    });

    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);
    //? cuando traemos el item, no viene con el usuario, asi que lo podemos agregar, para que se vea en el response de apollo, lo siguiente:
    // item.user = user;//*pero con el lazy ya no es necesario

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User ): Promise<Item> {

    await this.findOne( id, user );
    

    //*no es necesario colocarle el id cuando usamos el preload, ya que eso lo validamos en el mismo input. Es algo diferente en el caso de los dtos sin graphql
    //? el preload busca por el id y si lo encuentra lo carga en la variable item
    const item = await this.itemsRepository.preload( updateItemInput );
    // const item = await this.itemsRepository.preload({ ...updateItemInput, user });//? con el lazy nos evitamos esto

    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);

    return this.itemsRepository.save( item );

  }

  async remove( id: string, user: User ):Promise<Item> {
    // TODO: soft delete, integridad referencial
    const item = await this.findOne( id, user );
    await this.itemsRepository.remove( item );
    return { ...item, id };
  }

  //*metodo para saber cuantos items tiene un usuario
  async itemCountByUser( user: User ): Promise<number> {
    
    return this.itemsRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    })

  }
}
