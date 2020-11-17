import sqlite from 'sqlite-async'

const MS = 1000

class Feedback {
	constructor(dbName = ':memory:') {
		return (async () => {
			this.db = await sqlite.open(dbName)

			const sql = 'CREATE TABLE IF NOT EXISTS feedback\
			(id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER NOT NULL, newsid INTEGER NOT NULL, \
				rating INTEGER NOT NULL, comment LONGTEXT, dateAdded TEXT NOT NULL, \
				FOREIGN KEY (userid) REFERENCES users(id), FOREIGN KEY (newsid) REFERENCES news(id));'
			await this.db.run.sql;
			return this
		})()
	}

	async getByNewsId(newsid) {
		if (!Number.isNaN(parseInt(newsid))) {
			try {
				const sql = `SELECT feedback.*, users.user FROM feedback \
		INNER JOIN users ON feedback.userid=users.id  WHERE feedback.newsid=${newsid} ORDER BY feedback.dateAdded  ASC ;`
				console.log('sql', sql)
				const feedback = await this.db.all(sql)
				console.log('feedback1', feedback);
				console.log('feedback.length', feedback.length);
				for (const index in feedback) {
					const dateTime = new Date(feedback[index].dateAdded * MS)
					const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`
					feedback[index].dateAdded = formattedDate
				}
				return feedback
			} catch (err) {
				console.log(err, 'err')
				throw err
			}
		} else {
			throw new Error('Invalid path to feedback')
		}
	}

	async add(data) {
		console.log(data)
		if (!data.rating) throw new Error('missing rating')
		if (!data.newsid) throw new Error('missing news id')
		if (!data.userid) throw new Error('missing user id')
		const timestamp = Math.floor(Date.now() / MS)
		let sql
		try {
			if (!data.comment) {
				sql = `INSERT INTO feedback(userid, newsid, rating, dateAdded) \
				VALUES(${data.userid},${data.newsid},${data.rating},${timestamp})`
			}
			else {
				sql = `INSERT INTO feedback(userid, newsid, rating, comment, dateAdded) \
				VALUES(${data.userid},${data.newsid},${data.rating},'${data.comment}',${timestamp})`
			}
			console.log(sql)
			await this.db.run(sql)
		} catch (err) {
			throw err
		}
		return true
	}

	async close() {
		await this.db.close()
	}
}
export default Feedback