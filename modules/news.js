import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'

const MS = 1000

class News {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)

			const sql = 'CREATE TABLE IF NOT EXISTS news\
			(id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER, title TEXT NOT NULL, \
					photo TEXT NOT NULL, article LONGTEXT NOT NULL, dateAdded TEXT NOT NULL, \
					status TEXT DEFAULT "pending", FOREIGN KEY (userid) REFERENCES users(id));'
			await this.db.run(sql)
			return this
		})()
	}

	async all(status = 'released') {
		const sql = `SELECT users.user, news.* FROM news, users\
		 WHERE news.userid = users.id AND status="${status}" ORDER BY news.dateAdded DESC;`
		const news = await this.db.all(sql)
		for (const index in news) {
			const dateTime = new Date(news[index].dateAdded * MS)
			const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`
			news[index].dateAdded = formattedDate
		}
		return news
	}

	async add(data) {
		if (!data.title) throw new Error('missing title')
		if (!data.article) throw new Error('missing article body')
		let filename
		if (data.fileName) {
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
			await this.db.run(sql)
		} catch (err) {
			throw err
		}
		return true
	}

	async find(newsid) {
		if (!Number.isNaN(parseInt(newsid))) {
			try {
				const sql = `SELECT news.*, users.user, users.email FROM news \
        INNER JOIN users ON news.userid=users.id WHERE news.id=${newsid};`
				const article = await this.db.get(sql)
				const dateTime = new Date(article.dateAdded * MS)
				const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`
				article.dateAdded = formattedDate
				return article
			} catch (err) {
				console.log(err, 'err')
				throw err
			}
		} else {
			throw new Error('Invalid path to article')
		}
	}

	async updateStatus(newsid, status) {
		try {
			const sql = `UPDATE news SET status="${status}" WHERE id=${newsid};`
			console.log('sql', sql)
			await this.db.run(sql)
		} catch (err) {
			console.log('err', err)
			throw err
		}
	}

	async edit(article) {
		if (!article.title) throw new Error('missing title')
		if (!article.article) throw new Error('missing article body')
		let filename
		if (article.fileName) {
			filename = `${Date.now()}.${mime.extension(article.fileType)}`
			await fs.copy(article.filePath, `public/images/${filename}`)
		}
		const timestamp = Math.floor(Date.now() / MS)
		let sql
		if (!filename) {
			sql = `UPDATE news SET title="${article.title}", article="${article.article}",\ 
				dateAdded="${timestamp}", status="pending" WHERE id=${article.newsid};`
		} else {
			sql = `UPDATE news SET title="${article.title}", article="${article.article}",\
				photo="${filename}", dateAdded="${timestamp}", status="pending" WHERE id=${article.newsid};`
		}
		await this.db.run(sql)
		return true
	}

	async close() {
		await this.db.close()
	}
}

export default News
