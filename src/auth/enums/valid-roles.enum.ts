import { registerEnumType } from "@nestjs/graphql";


export enum ValidRoles {

    admin = 'admin', 
    user = 'user', 
    superUser = 'superUser'
}
//! Implementacion de la enumeracion en graphql, es decir que en las variables, nos saldrán las respectivas enumeraciones como en typeScript y solo esas se podrán colocar en Graphql, es decir estarán validadas solo en Graphql. Pero con eso es suficiente
registerEnumType( ValidRoles, { name: 'ValidRoles', description: 'Únicos roles de los usuarios' } )//*descripcion es para la documentacion de graphql

//*usamos esto para no hacer la validacion de string === "admin".
//*En vez de eso, podemos hacer ValidRoles.admin