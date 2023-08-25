import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ListItem } from './../../list-item/entities/list-item.entity';
import { User } from './../../users/entities/user.entity';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  name: string;

  // Relación, index('userId-list-index')
  @ManyToOne( () => User, (user) => user.lists, { nullable: false, lazy: true  })//! por la relacion  @ManyToOne, esta variable aparecerá en nuestra tabla
  @Index('userId-list-index')
  @Field( () => User )
  user: User;

  @OneToMany( () => ListItem, (listItem) => listItem.list, { lazy: true })//! por la relacion  @OneToMany, no veremos esta variable en nuestra tabla
  @Field( () => [ListItem] )//*con esto podemos usar la variable ListItem dentro del objeto List.
  //! En cualquier propiedad del objeto List se puede ver esto, gracias al Field.
  // @Field( () => [ListItem] )//* se deberia comentar para usar el resolveField, pero lo dejamos para notar una diferencia, uno saldrá con () por la paginacion, pero el otro será este sin ()
  listItem: ListItem[];
  
}
