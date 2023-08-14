import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {

    //! Override
    getRequest( context: ExecutionContext ) {

        const ctx = GqlExecutionContext.create( context );
        const request = ctx.getContext().req;

        return request;
        //*obtenemos el request
    }

}//! todo es sacado de la documentacion de passport. Hacemos esto porque no funciona el @UseGuards( AuthGuard() ) para graphql