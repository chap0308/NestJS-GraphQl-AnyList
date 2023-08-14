import { CreateItemInput } from './create-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  
  @Field(() => ID)
  @IsUUID()//*al ser UUID no necesita la validacion de IsOptional o IsString
  id: string;

}
