import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from 'dotenv'
import { join } from "path";
dotenv.config()


export const typeOrmConfig:TypeOrmModuleOptions = {

    type:'postgres',
    host:process.env.DATABASE_HOST,
    port:parseInt(process.env.DATABASE_PORT),
    username:process.env.DATABASE_USERNAME,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME,
    entities:[join(__dirname,'/../**/*.entity{.ts,.js}')],
    migrations:[join(__dirname,'/../database/migrations/*{.ts,.js}')],
    synchronize: true,         // 'false' em produção; use 'true' apenas no desenvolvimento inicial
    logging: true, 


}