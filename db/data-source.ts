import { DataSource, DataSourceOptions } from 'typeorm'

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',

    password: '',

    database: 'free',
    entities: ['dist/**/entities/*.entity{.ts,.js}'],
    synchronize: true,
    ssl: { "rejectUnauthorized": true },
    migrations: ['dist/db/migrations/*{.ts,.js}'],



}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource;