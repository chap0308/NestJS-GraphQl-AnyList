import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()//! InputType: ES LO QUE EL FROTEND NOS MANDA, Y SIEMPRE VIENE COMO UN OBJETO CON UNA O MÁS PROPIEDADES. EN APOLLO ES LA PARTE DE "VARIABLES"
export class SignupInput {
    
    @Field( () => String )
    @IsEmail()
    email: string;
    
    @Field( () => String )
    @IsNotEmpty()
    fullName: string;

    @Field( () => String )//? Acá si colocamos el password porque es necesario para el registro. Esto es solo para colocar en la parte de variables de apollo, no para mostrar en el response
    @MinLength(6)
    password: string;

}