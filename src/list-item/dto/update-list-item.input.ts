import { CreateListItemInput } from './create-list-item.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateListItemInput extends PartialType(CreateListItemInput) {
  
  @Field(() => ID )
  @IsUUID()//*al ser UUID no necesita la validacion de IsOptional o IsString
  id: string;

}
