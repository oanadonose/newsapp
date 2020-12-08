const dbEngine = process.env.DB_ENVIRONMENT || 'development'
import configs from './knexfile.js'
import knex from 'knex'

const config = configs[dbEngine]
export default knex(config)


