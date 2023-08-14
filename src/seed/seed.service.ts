import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './data/seed-data';

import { Item } from './../items/entities/item.entity';
import { List } from './../lists/entities/list.entity';
import { ListItem } from './../list-item/entities/list-item.entity';
import { User } from './../users/entities/user.entity';

import { ItemsService } from '../items/items.service';
import { ListsService } from './../lists/lists.service';
import { ListItemService } from './../list-item/list-item.service';
import { UsersService } from './../users/users.service';


@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,//*una vez importado el ConfigModule, podemos usar el ConfigService para usar las variables de entorno
        //! NOTA IMPORTANTE:
        //? despues de importar los TypeOrmModules en cada uno, podemos inyectar el Repository de esta manera:
        @InjectRepository(Item)//! este Item es de la entidad. Por eso necesitamos exportar el TypeOrmModule del propio modulo, para poder usarlo.
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(User)//! este User es de la entidad. Por eso necesitamos exportar el TypeOrmModule del propio modulo, para poder usarlo.
        private readonly usersRepository: Repository<User>,

        @InjectRepository(ListItem)
        private readonly listItemsRepository: Repository<ListItem>,

        @InjectRepository(List)
        private readonly listsRepository: Repository<List>,
        //?

        //? Pero esto es por importar en nuestro modulo ItemsModule y UsersModule; y tambien por exportar en cada uno de sus propios modulos: ItemsService y UsersService 
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listsService: ListsService,
        private readonly listItemService: ListItemService,
        //?
    ) {
        this.isProd = configService.get('STATE') === 'prod';//*STATE proviene de las variables de entorno.
    }


    async executeSeed() {
        
        //Validacion para que no se ejecute en produccion
        if ( this.isProd ) {//* solo en desarollo se va a poder ejecutar
            throw new UnauthorizedException('We cannot run SEED on Prod');
        }

        // Limpiar la base de datos BORRAR TODO
        await this.deleteDatabase();

        //! El orden es importante, porque dependen de las otras tablas

        //! Crear usuarios: Primero debemos crear los usuarios, ya que, los items dependen de esta tabla
        const user = await this.loadUsers();//* solo obtenemos el primer usuario

        //! Crear items luego de crear los usuarios
        await this.loadItems( user );//* no retorna nada, solo guarda en la base de datos

        //! Crear listas
        const list = await this.loadLists( user );//* solo obtenemos la primera lista

        //! Crear listItems
        const items = await this.itemsService.findAll(user, { limit: 15, offset: 0 }, {});//* obtenemos todos los items

        await this.loadListItems( list, items )//*solo mandamos una lista

        return true;
    }

    async deleteDatabase() {

        //! ListItems: para borrar es lo contrario a crear, primero borrar desde la tabla detalle
        await this.listItemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        //! Lists: una vez borrado los detalles, borrar la lista
        await this.listsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        //! borrar items: cada item tiene una llave foranea de los usuarios, por eso primero borramos esto y luego los users.
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        //! borrar users
        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

    }

    async loadUsers(): Promise<User> {

        const users = [];

        for (const user of SEED_USERS ) {
            //*esto guarda todos los usuarios en la base de datos usando el metodo de usersService
            users.push( await this.usersService.create( user ) )//! se hashea acá
        }

        return users[0];//*solo mandamos el primer usuario, para usarlo en el seed

    }


    async loadItems( user: User ): Promise<void> {

        const itemsPromises = [];
        
        for (const item of SEED_ITEMS ) {
            itemsPromises.push( this.itemsService.create( item, user ) );//*esto guarda todos los usuarios en la base de datos usando el metodo de itemsService
        }
        
        //? demora un poco más de esta manera
        await Promise.all( itemsPromises );
        //* no retorna nada

    }

    async loadLists( user: User ): Promise<List> {

        const lists = [];

        for (const list of SEED_LISTS ) {
            lists.push( await this.listsService.create( list, user ) )//*esto guarda todos los listas en la base de datos usando el metodo de listsService
        }

        return lists[0];//*solo mandamos la primera lista para usarlo en el seed

    }

    async loadListItems( list: List, items: Item[] ) {

        const listItems =items.map( item => item.id)

        this.listItemService.create({
            quantity: Math.round( Math.random() * 10 ),
            completed: Math.round( Math.random() * 1 ) === 0 ? false : true,
            listId: list.id,//*siempre es una misma lista
            itemId: listItems//*este es el único que itera
        });
        

        // this.listItemService.create({
        //     quantity: Math.round( Math.random() * 10 ),
        //     completed: Math.round( Math.random() * 1 ) === 0 ? false : true,
        //     listId: list.id,//*siempre es una misma lista
        //     itemId: items.id//*este es el único que itera
        // });

    }

}
