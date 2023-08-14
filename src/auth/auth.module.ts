import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],//! IMPORTANTE PARA USAR EL REST TRADICIONAL
  providers: [AuthResolver, AuthService, JwtStrategy],//* Como lo creamos manualmente debemos colcar el mismo nombre (JwtStrategy) de la clase creada acá. Es el mismo nombre de la clase creada en el archivo strategies.
  exports: [JwtStrategy, PassportModule, JwtModule],
  imports: [
    ConfigModule,
    
    PassportModule.register({ defaultStrategy: 'jwt' }),

    //! JWT: Dice como firma, autentica y como verifica los tokens
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn:'4h'
          }
        })
    }),
    UsersModule,//! para usar un controller o service de otro modulo se necesita importar el MODULO y ser exportado de su propio modulo
  ]
})
export class AuthModule {}
