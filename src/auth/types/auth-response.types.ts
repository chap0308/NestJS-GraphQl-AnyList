import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";

@ObjectType()//! ObjectType: ES LA INFORMACION CON LA QUE NOSOTROS QUEREMOS RESPONDER NUESTRO QUERYS EN APOLLO( ES EL RESPONSE )
export class AuthResponse {

    @Field( () => String )
    token: string;

    @Field( () => User )
    user: User;

}