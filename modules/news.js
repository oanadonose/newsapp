import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'

const MS = 1000

class News {

	constructor(dbName = ':memory:') {
		return(async() => {
			this.db = await sqlite.open(dbName)

			const sql = 'CREATE TABLE IF NOT EXISTS news\
			(id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER, title TEXT NOT NULL, \
					photo TEXT NOT NULL, article LONGTEXT NOT NULL, dateAdded TEXT NOT NULL, \
					FOREIGN KEY (userid) REFERENCES users(id));'
			await this.db.run(sql)
			return this
		})()
	}

	async all() {
		const sql = 'SELECT users.user, news.* FROM news, users\
		 WHERE news.userid = users.id ORDER BY news.dateAdded DESC;'
		const news = await this.db.all(sql)
		for(const index in news) {
			const dateTime = new Date(news[index].dateAdded * MS)
			const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
			news[index].dateAdded = formattedDate
		}
		return news
	}

	async add(data) {
		let filename
		if(data.fileName) {
			filename = `${Date.now()}.${mime.extension(data.fileType)}`
			await fs.copy(data.filePath, `public/images/${filename}`)
		} else {
			//placeholder image
			filename = 'image_2.jpg'
		}
		const timestamp = Math.floor(Date.now() / MS)
		try {
			const sql = `INSERT INTO news(userid, title, article, photo, dateAdded)\
			VALUES(${data.account},'${data.title}','${data.article}','${filename}',${timestamp});`
			console.log('sql', sql)
			await this.db.run(sql)
			return true
		} catch(err) {
			console.log(err, 'err')
			throw err
		}
	}

	async find(userid, newsid) {
		if(!Number.isNaN(parseInt(newsid))) {
			try {
				const sql = `SELECT * FROM news INNER JOIN users ON users.id=news.userid WHERE news.id=${newsid};`
				console.log(sql)
				const article = await this.db.get(sql)
				const dateTime = new Date(article.dateAdded * MS)
				const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
				article.dateAdded = formattedDate
				return article
			} catch(err) {
				console.log(err, 'err')
				throw err
			}
		} else {
			throw new Error('Invalid path to article')
		}
	}

	async close() {
		await this.db.close()
	}
}

export default News
