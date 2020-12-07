module.exports = {
  
  migrations: {
    directory: './migrations',
    loadExtensions: ['.js']
  },

  development: {
    client: 'sqlite3',
    connection: {
      filename: './website.db'
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done);
      }
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
