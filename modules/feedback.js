import sqlite from 'sqlite-async'

const MS = 1000

class Feedback {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS feedback\
			(id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER NOT NULL, newsid INTEGER NOT NULL, \
				rating INTEGER NOT NULL, comment LONGTEXT, dateAdded TEXT NOT NULL, \
				FOREIGN KEY (userid) REFERENCES users(id), FOREIGN KEY (newsid) REFERENCES news(id));'
			await this.db.run(sql)
			return this
		})()
	}

	async getByNewsId(newsid) {
		if (!Number.isNaN(parseInt(newsid))) {
			try {
				const sql = `SELECT feedback.*, users.user FROM feedback \
				INNER JOIN users ON feedback.userid=users.id  WHERE feedback.newsid=${newsid}\
		 		ORDER BY feedback.dateAdded  ASC ;`
				const feedback = await this.db.all(sql)
				for (const index in feedback) {
					const dateTime = new Date(feedback[index].dateAdded * MS)
					const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`
					feedback[index].dateAdded = formattedDate
				}
				return feedback
			} catch (err) {
				throw err
			}
		} else {
			throw new Error('Invalid path to feedback')
		}
	}

	async add(data) {
		if (!data.rating) throw new Error('missing rating')
		if (!data.newsid) throw new Error('missing news id')
		if (!data.userid) throw new Error('missing user id')
		const timestamp = Math.floor(Date.now() / MS)
		let sql
		if (!data.comment) {
			sql = `INSERT INTO feedback(userid, newsid, rating, dateAdded) \
			VALUES(${data.userid},${data.newsid},${data.rating},${timestamp})`
		} else {
			sql = `INSERT INTO feedback(userid, newsid, rating, comment, dateAdded) \
			VALUES(${data.userid},${data.newsid},${data.rating},'${data.comment}',${timestamp})`
		}
		await this.db.run(sql)
		return true
	}

	async close() {
		await this.db.close()
	}
}
export default Feedback
