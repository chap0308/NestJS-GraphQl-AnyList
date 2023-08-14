import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class SearchArgs {

    @Field( ()=> String, { nullable: true })//*opcional en graphql
    @IsOptional()//*opcional en nestjs
    @IsString()
    search?: string;//*sí es opcional


}

