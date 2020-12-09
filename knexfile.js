export default {

	migrations: {
		directory: './migrations',
		loadExtensions: ['.js','.cjs', '.mjs']
	},
	seeds: {
		directory: './seeds',
		loadExtensions: ['.cjs']
	},

	development: {
		client: 'sqlite3',
		connection: {
			filename: './website.db'
		},
		useNullAsDefault: true,
		pool: {
			afterCreate: (conn, done) => {
				conn.run('PRAGMA foreign_keys = ON', done)
			}
		}
	},

	test: {
		client: 'sqlite3',
		seeds: {
			directory: './seeds',
			loadExtensions: ['.cjs']
		},
		connection: {
			filename: './test.db'
		},
		useNullAsDefault: true,
		pool: {
			afterCreate: (conn, done) => {
				conn.run('PRAGMA foreign_keys = ON', done)
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

}
