
import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'


class News {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			
			const sql = 'CREATE TABLE IF NOT EXISTS news\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER, title TEXT NOT NULL, photo TEXT NOT NULL, article TEXT NOT NULL, dateAdded TEXT NOT NULL, FOREIGN KEY (userid) REFERENCES users(id));'
			await this.db.run(sql)
			return this
		})()
    }
    
    async all() {
        const sql = 'SELECT users.user, news.* FROM news, users WHERE news.userid = users.id;';
        const news = await this.db.all(sql);
        return news;
    }

	async close() {
		await this.db.close()
	}
}

export { News }
