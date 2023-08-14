import { InputType, Int, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {//*son las mismas variables que el signup.input.ts

    @Field( () => String )
    @IsString()
    @IsEmail()
    @Transform( ({value}) => value.trim() )//*Validaciones para el trim, tambien se puede usar .toUpperCase()
    email: string;

    @Field( () => String )//*lo usamos acá para poder actualizarlo, pero no se verá en el Apollo
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    @Transform( ({value}) => value.trim() )
    password: string;

    @Field( () => String )
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    @Transform( ({value}) => value.trim() )
    fullName: string;

}
