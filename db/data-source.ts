import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm'

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource;