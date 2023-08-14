import { ListItem } from './../../list-item/entities/list-item.entity';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './../../users/entities/user.entity';

@Entity({name: 'items'})
@ObjectType()
export class Item {
  
  //? EL ORDEN DE LOS DECORADORES NO ES IMPORTANTE, PUEDES COLOCAR PRIMERO EL DE TYPEORM O EL DE GRAPHQL, PERO SI ES IMPORTANTE SEGUIR ESE ORDEN PARA LOS DEMÁS
  // EN ESTE CASO:
  //*PRIMERO: TYPEORM
  //*SEGUNDO: GRAPHQL
  //*TERCERO: TYPESCRIPT


  @PrimaryGeneratedColumn('uuid')//*tambien puede ser 'increment', tomar en cuenta eso
  @Field( () => ID ) 
  id: string;

  @Column()
  @Field( () => String )
  name: string;

  // @Column()
  // @Field( () => Float )
  // quantity: number;

  @Column({ nullable: true })
  @Field( () => String, { nullable: true } )
  quantityUnits?: string; // g, ml, kg, tsp

  // stores
  // user
  //! por la relacion  @ManyToOne, esta variable aparecerá en nuestra tabla
  @ManyToOne( () => User, (user) => user.items, { nullable: false, lazy: true })//*el lazzy hace que podamos mostrar esta variable en todas las consultas con relacion a esta
  //? cuando queramos ver todos los items, apareceran con su respectivo usuario
  @Index('userId-index')//*puede tener cualquier nombre, esto añade un indice a la consulta y permite que nuestro query sea más rápidos
  @Field( () => User )
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })//! por la relacion  @OneToMany, no veremos esta variable en nuestra tabla
  @Field( () => [ListItem] )//*propio de esta variable para graphql
  listItem: ListItem[]

}
