import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Item } from './../../items/entities/item.entity';
import { List } from './../../lists/entities/list.entity';

@Entity('listItems')
//! El constrain en TypeORM se añade en la entidad de ListItem y luego se coloca el decorador:
@Unique('listItem-item', ['list','item'])//* Los constrains son reglas de validación para la base de datos. Esto nos ayuda a que no podamos tener registros duplicados en la misma.
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column({ type: 'numeric' })
  @Field( () => Number )
  quantity: number;

  @Column({ type: 'boolean' })
  @Field( () => Boolean )
  completed: boolean;


  // Relaciones
  @ManyToOne( () => List, (list) => list.listItem, { lazy: true })//! por la relacion  @ManyToOne, esta variable aparecerá en nuestra tabla
  // @Field( () => [ListItem] )
  @Field( () => List )//! con esto podemos usar la variable list dentro de cualquier variable que sea de tipo ListItem, incluyendo @ResolveFiel(). Importante colocar el lazy para que se vea en graphql
  list: List;

  @ManyToOne( () => Item, (item)=> item.listItem, { lazy: true })//! por la relacion  @ManyToOne, esta variable aparecerá en nuestra tabla
  @Field( () => Item )//! con esto podemos usar la variable item dentro del objeto ListItem. Importante colocar el lazy para que se vea en graphql
  item: Item;

  


}
