import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'

class News {

	constructor(dbName = ':memory:') {
		return(async() => {
			this.db = await sqlite.open(dbName)

			const sql = 'CREATE TABLE IF NOT EXISTS news\
			(id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER, title TEXT NOT NULL, \
					photo TEXT NOT NULL, article TEXT NOT NULL, dateAdded TEXT NOT NULL, \
					FOREIGN KEY (userid) REFERENCES users(id));'
			await this.db.run(sql)
			return this
		})()
	}

	async all() {
		const sql = 'SELECT users.user, news.* FROM news, users WHERE news.userid = users.id ORDER BY news.dateAdded DESC;'
		const news = await this.db.all(sql)
		for(let index in news) {
			let dateTime = new Date(news[index].dateAdded * 1000)
			const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`;
			news[index].dateAdded = formattedDate		
		}
		return news
	}
	
	async add(data) {
		const filenamep = 'image_1.jpg'
		let filename
		if(data.fileName) {
			filename = `${Date.now()}.${mime.extension(data.fileType)}`
			console.log('filename', filename)
			await fs.copy(data.filePath, `public/images/${filename}`)
		}
		else {
			filename = 'image_2.jpg'
		}
		const timestamp = Math.floor(Date.now() / 1000)
		try {
			const sql = `INSERT INTO news(userid, title, article, photo, dateAdded)\
			VALUES(${data.account},'${data.title}','${data.article}','${filename}',${timestamp});`;
			console.log('sql', sql)
			await this.db.run(sql)
			return true
		} catch(err) {
			console.log(err, 'err');
			throw(err)
		}
	}

	async close() {
		await this.db.close()
	}
}

export default News
