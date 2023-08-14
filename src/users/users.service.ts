import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../auth/dto/rest';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class UsersService {

  //! esto es para ver en la consola el mensaje que se envia desde el servicio
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)//*este User es de la entidad. Por eso necesitamos exportar el TypeOrmModule del propio modulo, para poder usarlo.
    private readonly usersRepository: Repository<User>
  ){}
  
  //? este metodo es usado en authService
  // async create( signupInput: SignupInput ): Promise<User> {//*esto es para graphql, pero mejor es hacer en REST
  async create( signupInput: CreateUserDto ): Promise<User> {//*con este dto si tendrá las validaciones
    try {

      const newUser = this.usersRepository.create({ 
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10 )
      });

      // const newUser = this.usersRepository.create(signupInput)

      return await this.usersRepository.save( newUser ); 

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  //*Mostrar usuarios con paginacion y busqueda
  async findAll( roles: ValidRoles[], paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<User[]> {

    const { limit, offset } = paginationArgs;//*ya vienen con valores por defecto
    const { search } = searchArgs;//*puede venir undefined

    const queryBuilder = this.usersRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )

    if ( search ) {//*si viene undefined
      //? .andWhere permite seguir la consulta de un queryBuilder
      //! OJO: COLOCAR en comillas la variable, porque sino tambien lo coloca en minuscula la variable de la base de datos. COLOCAR ASÍ: "fullName" 
      queryBuilder.andWhere('LOWER("fullName") like :name', { name: `%${ search.toLowerCase() }%` });//? LOWER("fullName") es de la base de datos, lo demás es la variable que queremos asignar.

    }

    if (roles.length !== 0) {
      queryBuilder
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')//* el primer array es de la base de datos y el segundo es un parametro exterior ":...roles"
      .setParameter('roles', roles)//*el parametro exterior se coloca acá y luego se le asigna la variable de typeScript
    } 

    return await queryBuilder.getMany();//*esto es el producto del queryBuilder, que es un listado de usuarios
  
  }


  //? Mostrar todos los usuarios (Anterior forma)
  // async findAll( roles: ValidRoles[] ): Promise<User[]> {

    // if ( roles.length === 0 ){
    //   return this.usersRepository.find({
        //* No es necesario porque tenemos lazy en la propiedad lastUpdateBy, automaticamente tambien muestra en la consulta de abajo las relaciones con la propiedad lastUpdateBy
    //     relations: {
    //       lastUpdateBy: true
    //     }
    //   });
    // }

    //! el lazy aplica tambien a esta consulta
    // ??? tenemos roles ['admin','superUser']
    // return this.usersRepository.createQueryBuilder()
      //? el andWhere es para el uso de varios wheres, en este caso solo hay uno pero aún así funciona
      // .andWhere('ARRAY[roles] && ARRAY[:...roles]')//* el primer array es de la base de datos y el segundo es un parametro exterior ":...roles"
      // .setParameter('roles', roles )//*el parametro exterior se coloca acá y luego se le asigna la variable de typeScript
      // .getMany();//*esto es el producto del queryBuilder, que es un listado de usuarios
    //? si colocamos en apollo "superUser", solo vendrá los usuarios que tengan el rol de superUser
    
  // }

  
  //? este metodo es usado en authService
  async findOneByEmail( email: string ): Promise<User> {
  
    try {
      return await this.usersRepository.findOneByOrFail({ email })//*es propio de TypeOrm
    } catch (error) {
      
      throw new NotFoundException(`${ email } not found`);

      // this.handleDBErrors({
      //   code: 'error-001',
      //   detail: `${ email } not found`
      // });
    }

  }


  async findOneById( id: string ): Promise<User> {
  
    try {
      return await this.usersRepository.findOneByOrFail({ id })
    } catch (error) {
      throw new NotFoundException(`${ id } not found`);
    }

  }

  async update(
    id: string, 
    updateUserInput: UpdateUserInput,
    updateBy: User
  ): Promise<User> {

    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        password: updateUserInput.password ? bcrypt.hashSync( updateUserInput.password, 10 ) : updateUserInput.password,
        id
      });

      user.lastUpdateBy = updateBy;

      return await this.usersRepository.save( user );

    } catch (error) {
      this.handleDBErrors( error );
    }
    
    
  }

  async block( id: string, adminUser: User ): Promise<User> {
    
    const userToBlock = await this.findOneById( id );

    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;

    return await this.usersRepository.save( userToBlock );

  }

  private handleDBErrors( error: any ): never{

    // this.logger.error( error );//*para ver en la consola el mensaje que enviamos
    
    if( error.code === '23505' ){//* llave duplicada
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    if( error.code == 'error-001' ){
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    this.logger.error( error );//*para ver en la consola el mensaje que enviamos
    
    throw new InternalServerErrorException('Please check server logs');
  }

}
