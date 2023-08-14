import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()//! InputType: ES LO QUE EL FROTEND NOS MANDA, Y SIEMPRE VIENE COMO UN OBJETO CON UNA O MÁS PROPIEDADES. EN APOLLO ES LA PARTE DE "VARIABLES"
export class CreateItemInput {

  //? EL ORDEN DE LOS DECORADORES NO ES IMPORTANTE, PUEDES COLOCAR PRIMERO EL DE NESTJS O EL DE GRAPHQL, PERO SI ES IMPORTANTE SEGUIR ESE ORDEN PARA LOS DEMÁS
  // EN ESTE CASO:
  //*PRIMERO: GRAPHQL
  //*SEGUNDO: NESTJS
  //*TERCERO: TYPESCRIPT
  
  @Field( () => String )//? GRAPHQL
  @IsNotEmpty()//? NESTJS
  @IsString()
  name: string;//? TYPESCRIPT

  // @Field( () => Float )
  // @IsPositive()
  // quantity: number;
  
  //*SE COLOCA LA VALIDACION OPCIONAL PARA TODOS
  @Field( () => String, { nullable: true })
  @IsString()
  @IsOptional()
  quantityUnits?: string;

}