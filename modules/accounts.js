
import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'

const saltRounds = 10

class Accounts {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT NOT NULL, pass TEXT NOT NULL, email TEXT NOT NULL,\
					admin INTEGER DEFAULT 0, points INTEGER DEFAULT 0, subscribed INTEGER NOT NULL DEFAULT 0);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * registers a new user
	 * @param {String} user the chosen username
	 * @param {String} pass the chosen password
	 * @returns {Boolean} returns true if the new user has been added
	 */
	async register(user, pass, email, subscribed) {

		Array.from(arguments).forEach(val => {
			if (val.length === 0) throw new Error('missing field')
		})
		let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
		const data = await this.db.get(sql)
		if (data.records !== 0) throw new Error(`username "${user}" already in use`)
		sql = `SELECT COUNT(id) as records FROM users WHERE email="${email}";`
		const emails = await this.db.get(sql)
		if (emails.records !== 0) throw new Error(`email address "${email}" is already in use`)
		pass = await bcrypt.hash(pass, saltRounds)
		sql = `INSERT INTO users(user, pass, email, subscribed) 
      VALUES("${user}", "${pass}", "${email}", ${subscribed === 'on' ? '1' : '0'});`
		await this.db.run(sql)
		return true
	}

	async getUserLeaderboards() {
		const sql = 'SELECT * FROM users ORDER BY points DESC LIMIT 10;'
		const data = await this.db.all(sql)
		return data
	}

	async getSubscribedUsers() {
		const sql = 'SELECT * FROM users WHERE subscribed=1;'
		const data = await this.db.all(sql)
		return data
	}

	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} username the username to check
	 * @param {String} password the password to check
	 * @returns {Boolean} returns true if credentials are valid
	 */
	async login(username, password) {
		let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
		const records = await this.db.get(sql)
		if (!records.count) throw new Error(`username "${username}" not found`)
		sql = `SELECT * FROM users WHERE user = "${username}";`
		const record = await this.db.get(sql)
		const valid = await bcrypt.compare(password, record.pass)
		if (valid === false) throw new Error(`invalid password for account "${username}"`)
		console.log('record', record)
		return record
	}

	async getUserDetails(id) {
		const sql = `SELECT * FROM users where id=${id};`
		const userDetails = await this.db.get(sql)
		if (!userDetails) throw new Error(`no user found for id ${id}`)
		console.log('userDetails', userDetails)
		return userDetails
	}

	async addPoints(id, pointsToAdd) {
		if (typeof pointsToAdd === 'number') {
			const sql = `UPDATE users SET points=points+${pointsToAdd} WHERE id=${id};`
			console.log(sql, 'sql add points')
			await this.db.run(sql)
		} else throw new Error('points must be integer')
	}
	async close() {
		await this.db.close()
	}
}

export default Accounts
