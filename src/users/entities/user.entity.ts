import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Item } from './../../items/entities/item.entity';
import { List } from './../../lists/entities/list.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  fullName: string;

  @Column({ unique: true })
  @Field( () => String )
  email: string;

  @Column()
  // @Field(() => String)//*No queremos mostrar esto cuando consulten nuestro ususarios. En apollo (Response)
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field( () => [ String ])
  roles: string[];

  @Column({
    type: 'boolean',
    default: true
  })
  @Field( () => Boolean )
  isActive: boolean;

  //TODO: relaciones
  //*typeOrm
  @ManyToOne( () => User, (user) => user.lastUpdateBy,//? relacion con la misma tabla
  { nullable: true, lazy: true })//! el lazy permite mostrar las relaciones de la misma tabla. A comparacion del eager, este tambien muestra las relaciones pero con otras tablas. Esto aplica a todas las consultas que se hagan de la respectiva propiedad  
  @JoinColumn({ name: 'lastUpdateBy' })
  //*GraphQL
  @Field( () => User, { nullable: true })
  lastUpdateBy?: User;
  
  //! por la relacion  @OneToMany, no veremos esta variable en nuestra tabla
  @OneToMany( () => Item, (item) => item.user, { lazy: true })//*con esto podemos mostrar los items cuando queramos ver todos los usuarios
  //? el lazy permitia ver esta variable con todas sus propiedades en graphql, pero lo quitamos porque queriamos que tenga paginacion y para eso necesitabamos un @ResolveField.
  // @Field( () => [Item] )//*Quitamos esto para usar el @ResolveField de users.resolver.ts. Son similares, solo que con este podemos hacer paginacion
  items: Item[];

  @OneToMany( () => List, (list) => list.user )//! por la relacion  @OneToMany, no veremos esta variable en nuestra tabla
  // @Field( () => [List] )//* comentamos esto porque usaremos un @ResolverField para mostrar las listas con su paginacion
  lists: List[];

}
