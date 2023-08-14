import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsArray, IsString } from "class-validator";
import { ValidRoles } from "../../../auth/enums/valid-roles.enum";

@ArgsType()//* es útil para cuando queremos usar más argumentos
export class ValidRolesArgs {

    @Field( () => [ValidRoles], { nullable: true } )
    @IsArray()
    roles: ValidRoles[] = []//*es necesario colocar las mismas validaciones en cada uno: graphql, nestjs, typescript

    // @Field( () => String, { nullable: true } )//*saldrá otro parametro más en apollo automaticamente
    // @IsString()
    // nombre: string;

}