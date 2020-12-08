// import knex from 'knex'
// import config from '../knexfile.cjs'
// const db = knex(config.development)

import db from '../dbConfig.js'
import bcrypt from 'bcrypt-promise'

const saltRounds = 10

//remove asyncs? 11

export const register = async(user) => {
	if(!user.password || !user.name || !user.email) return 0
	const pass = await bcrypt.hash(user.password, saltRounds)
	user.password = pass
	return await db('users').insert(user, ['id', 'name'])
}

export const login = async(name, password) => {
	const user = await findByName(name)
	console.log('user',user)
	const valid = await bcrypt.compare(password, user.password)
	if (valid === false) throw new Error(`invalid password for account "${name}"`)
	return db('users')
		.where({ name, password })
		.first()
}

export const findUsers = async() => db('users')
	.orderBy('points', 'desc')

export const findUserById = async(id) => db('users')
	.where({ id })
	.first()

export const findByName = async(name) => db('users')
	.where({ name })
	.first()


export const remove = async(id) => db('users')
	.where({ id })
	.del()

export const editUser = async(id, changes) => {
	await db('users')
		.where({ id })
		.update(changes)
	return findUserById(id)
}


export const findNewsById = (id) => db('news')
	.where({ id })
	.first()

export const findNewsByStatus = (status) => db('news')
	.where({ status })

export const addNews = async(userid, news) => await db('news')
	.where({ userid })
	.insert(news, ['id','title','userid'])

export const editNews = async(id, changes) => db('news')
	.where({ id })
	.update(changes, [id])

export const findUserNews = (userid) => db('news')
	.where({ userid })

export const getAllNews = async() => db('news')
