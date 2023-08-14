import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        //*No inyectamos el respository porque usamos un metodo del auth Service
        private readonly authService: AuthService,

        ConfigService: ConfigService
    ) {
        super({
            //! validamos la firma, solo podran ingresar los que tengan un Bearer token valido
            secretOrKey: ConfigService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    //! Esta funcion validate se ejecuta cuando usamos el @UseGuards
    async validate( payload: JwtPayload ): Promise<User> {

        // console.log({payload})//*tener en cuenta
        const { id } = payload;

        const user = await this.authService.validateUser( id );//*Esto es propio del authService y no de TypeORM
        
        return user;//*req.user OJO
        //! establecemos el usuario en el request
    }
}