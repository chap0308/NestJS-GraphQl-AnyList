import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { ItemsService } from '../items/items.service';
import { ListsService } from './../lists/lists.service';

import { Item } from './../items/entities/item.entity';
import { User } from './entities/user.entity';
import { List } from './../lists/entities/list.entity';

import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { PaginationArgs, SearchArgs } from './../common/dto/args';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Resolver(() => User)//! IMPORTANTE PARA EL @ResolveField()
@UseGuards( JwtAuthGuard )//! con esto todos los endpoint necesitarian el Bearer token, ESTO ES PARA VALIDAR QUE EL USUARIO ESTÉ AUTENTICADO, YA QUE PARA USAR ESTOS ENDPOINTS TIENE QUE TENER UNA CUENTA
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,//*para usar el metodo de contar items
    private readonly listsService: ListsService
  ) {}


  @Query(() => [User], { name: 'users' })//! Las mutaciones reciben @Args de tipo input y los querys @Args simples. Un query es como si fuera un GET, GETBYID. No modifica la base de datos.
  async findAll(
    //! OJO: se puede hacer de esta manera, pero recuerda que no tendrán las validaciones de class-validator, solo de graphQl. Por eso, es mejor hacer nuestras clases, pero para los id podemos usar simplemente ParseUUID y no habrá necesidad de hacer otra clase.
    // @Args('validRoles',{type: () => [ValidRoles]}) validRoles: ValidRoles,
    // @Args('nombre', {type: () => Int}) nombre: string,
    //!
    @Args() validRoles: ValidRolesArgs,
    @Args() paginationArgs: PaginationArgs,//! acá usamos multiples args (comentar forbidNonWhitelisted: true en main.ts)
    @Args() searchArgs: SearchArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,//*Para obtener el usuario que está conectado, son varias autenticaciones: jwt.strategy.ts, luego jwt-auth.guard y finalmente current-user.decorator.ts
  ): Promise<User[]> {
    // console.log({validRoles, nombre});
    // return `${validRoles} y ${typeof(nombre)}`;

    // console.log({validRoles})
    // console.log(user)//*obtener user
    return this.usersService.findAll(validRoles.roles, paginationArgs, searchArgs);
  }

  //? Anterior query que mostraba todos los usuarios sin paginacion
  // @Query(() => [User], { name: 'users' })
  // async findAll(
  //   @Args() validRoles: ValidRolesArgs,
  //   @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) user: User
  // ):Promise<User[]> {

  //   return this.usersService.findAll( validRoles.roles );
  // }

  @Query(() => User, { name: 'user' })
  async findOne( //! es un plus al igual que Promise<User>, para asegurarnos de la informacion que esperamos que venga
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) user: User
  ): Promise<User> {
    
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })//! la mutacion impacta en la base datos(POST, PATCH, DELETE)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin ]) user: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user );
  }

  @Mutation(() => User, { name: 'blockUser' })
  async blockUser( 
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ ValidRoles.admin ]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user );
  }

    //! resolveField: esto hace que podamos usar la funcion asignada (en este caso "itemCount") en cualquier endpoint de nuestro Resolver() (en este caso @Resolver(() => User)).
    //! ResolveField es algo que podrá ser usado en la entidad colocada, pero no pertenecerá a la base de datos. Es como si fuera una funcion para usar en graphql
    @ResolveField( () => Int, { name: 'itemCount' })
    async itemCount(
      @CurrentUser([ ValidRoles.admin ]) adminUser: User,//*solo los admis podrán usar este endpoint
      @Parent() user: User//*este parent hace que obtengamos el objeto padre(en el que está iterando) en graphql. Es como si fuera la funcion parentElement de javascript. Con esto podemos obtener al usuario con cualquier endpoint que usemos. Recuerda que esto no es un endpoint(@Query o @Mutation), solo se coloca como si fuera una variable en la parte de Operation de Apollo
    ): Promise<number> {
      // console.log({user});//? podemos usar esto para identificarlo
      return this.itemsService.itemCountByUser( user )//*con el @Parent, ya podemos obtener al usuario padre y lo mandamos a este metodo para obtener la cantidad de items que tiene
    }

    //! lo usamos como una funcion en graphql
    @ResolveField( () => [Item], { name: 'items' })
    async getItemsByUser(
      @CurrentUser([ ValidRoles.admin ]) adminUser: User,
      @Parent() user: User,
      @Args() paginationArgs: PaginationArgs,
      @Args() searchArgs: SearchArgs,
    ): Promise<Item[]> {
      // console.log({user});//? podemos usar esto para identificarlo
      return this.itemsService.findAll( user, paginationArgs, searchArgs );
    }

    @ResolveField( () => Int, { name: 'listCount' })
    async listCount(
      @CurrentUser([ ValidRoles.admin ]) adminUser: User,
      @Parent() user: User
    ): Promise<number> {
      return this.listsService.listCountByUser( user );
    }

  @ResolveField( () => [List], { name: 'lists' })
    async getListsByUser(
      @CurrentUser([ ValidRoles.admin ]) adminUser: User,
      @Parent() user: User,
      @Args() paginationArgs: PaginationArgs,
      @Args() searchArgs: SearchArgs,
    ): Promise<List[]> {
      return this.listsService.findAll( user, paginationArgs, searchArgs );
  }
}
