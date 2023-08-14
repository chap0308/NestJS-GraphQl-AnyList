```bash

$ yarn add @nestjs/graphql @nestjs/apollo @apollo/server graphql

$ nest g res items --no-spec
? What transport layer do you use? GraphQL (code first)
? Would you like to generate CRUD entry points? Yes

## Para generar la base de datos
$ docker-compose up -d

## Para que lea las variables de entorno
$ yarn add @nestjs/config

## Usar typeORM
$ yarn add @nestjs/typeorm typeorm pg

$ yarn add class-validator class-transformer

$ nest g res users --no-spec
? What transport layer do you use? GraphQL (code first)
? Would you like to generate CRUD entry points? Yes

$ nest g res auth --no-spec 
? What transport layer do you use? GraphQL (code first)
? Would you like to generate CRUD entry points? No

$ yarn add bcrypt

## Como usamos typescript necesitamos:
$ yarn add -D @types/bcrypt

## passport y jwt
$ yarn add @nestjs/passport passport
$ yarn add @nestjs/jwt passport-jwt
$ yarn add -D @types/passport-jwt

## Seed
Ejecutar la mutation executeSeed, para llenar la base de datos

$ nest g res seed --no-spec
? What transport layer do you use? GraphQL (code first)
? Would you like to generate CRUD entry points? No

$ nest g mo common

$ nest g res lists --no-spec
? What transport layer do you use? GraphQL (code first)
? Would you like to generate CRUD entry points? Yes

$ nest g res listItem --no-spec
? What transport layer do you use? GraphQL (code first)
? Would you like to generate CRUD entry points? Yes

```

## Entities: Tabla de la base de datos

## Dtos(inputs y args): Forma de la informacion que nos envia el fronted, como: objeto, array, number, etc

## En general, lo que deberiamos colocar en los argumentos(lo que manda el fronted) son: inputs o args.
## Y lo que mandariamos como respuesta serian entities o types
## Las mutaciones son tambien llamadas query mutations y sí son querys.

## Tanto las mutaciones como los querys pueden recibir @Args pero debemos tomar en cuenta que las mutaciones reciben @Args de tipo input y los querys @Args simples, y además:
## La principal diferencia entre un query y una mutacion es que la mutacion impacta en la base datos, es decir modifica o hace algun cambio(POST,PATCH,DELETE) en ella. Pero un query solo trae la informacion, como si fuera un get, getById.

----

## Se recomienda que el signup y login se hagan en un REST TRADICIONAL

## Para obtener el usuario que está conectado, son varias autenticaciones: jwt.strategy.ts, luego jwt-auth.guard y finalmente current-user.decorator.ts

----
## Para poder usar las variables de entorno en nuestros servicios, controladores o resolvers. Importamos en el module
imports: [
    ConfigModule
  ]

## PARA ENTENDER MÁS SOBRE LOS MODULOS, VER en seed/seed.service.ts

## La paginacion puede ir en items o users. Por eso lo colocamos en la carpeta common

## EL ENUM SIRVE PARA OBTENER TIPADO EN LA PARTE DE "VARIABLES" DE GRAPHQL, NO ES NECESARIO USARLO PARA OPERATION YA QUE ESO VIENE POR DEFECTO