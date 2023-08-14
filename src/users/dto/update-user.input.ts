import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';

import { CreateUserInput } from './create-user.input';
import { ValidRoles } from './../../auth/enums/valid-roles.enum';


@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {//*las variables de CreateUserInput se vuelven opcionales
  
  @Field(() => ID)
  @IsUUID()//! al ser UUID no necesita la validacion de IsOptional o IsString
  id: string;//*siempre debemos usar el id para actualizar, por eso no lo colocamos opcionales

  @Field( () => [ValidRoles], { nullable: true })
  @IsArray()
  @IsOptional()//*validamos que sean opcionales porque pueden o no ser actualizados
  roles?: ValidRoles[];

  @Field( () => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()//*validamos que sean opcionales porque pueden o no ser actualizados
  isActive?: boolean;

}
