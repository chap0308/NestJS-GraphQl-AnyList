import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';//! SIEMPRE USAR PARA EL APOLLO

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';

@Module({
  imports: [

    ConfigModule.forRoot(),

    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     return {
    //       playground: false,
    //       autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //       introspection: configService.getOrThrow<boolean>(
    //         'GRAPHQL_INTROSPECTION',
    //       ), // Generally false for production
    //       plugins: [ApolloServerPluginLandingPageLocalDefault()],
    //     };
    //   },
    //   inject: [ConfigService],
    // }),

    //! para usar se necesita hacer el deployment(Nestjs + Graphql Seccion 7 - 95)
    // GraphQLModule.forRootAsync({
    //   driver: ApolloDriver,
    //   imports: [ AuthModule ],
    //   inject: [ JwtService ],
    //   useFactory: async( jwtService: JwtService ) => ({
    //     playground: false,
    //     autoSchemaFile: join( process.cwd(), 'src/schema.gql'), 
    //     plugins: [
    //       ApolloServerPluginLandingPageLocalDefault
    //     ],
    //     context({ req }) {
            //*comentar esto para habilitar
    //       const token = req.headers.authorization?.replace('Bearer ','');
    //       if ( !token ) throw Error('Token needed');

    //       const payload = jwtService.decode( token );
    //       if ( !payload ) throw Error('Token not valid');
          
    //     }
    //   })
    // }),

    //! configuracion basica
    GraphQLModule.forRoot<ApolloDriverConfig>({//*localhost:3000/graphql
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),//*direccion de donde quieres generar la carpeta
      //! IMPORTANTE PARA USAR APOLLO:
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()//*con esto tenemos configurado Apollo
      ],
      //!
    }),

    //? configuracion para la base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',//*puede ser mysql, postgres, etc
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    //?
    
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
