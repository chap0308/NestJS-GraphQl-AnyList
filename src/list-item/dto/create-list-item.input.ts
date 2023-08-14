import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {

  @Field( () => Number, { nullable: true })//*al se nulo en graphql, toma el valor por default de typescript. En este caso, toma el 0 si no colocamos nada
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field( () => Boolean, { nullable: true })//*al se nulo en graphql, toma el valor por default de typescript. En este caso, toma el false si no colocamos nada
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field( () => ID )
  @IsUUID()//? al ser UUID no necesita la validacion de IsOptional o IsString
  listId: string;

  @Field( () => [ID] )
  @IsArray()
  // @IsUUID()//? al ser UUID no necesita la validacion de IsOptional o IsString
  itemId: string[];


}
