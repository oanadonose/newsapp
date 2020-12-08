// import knex from 'knex'
// import config from '../knexfile.cjs'
// const db = knex(config.development)

import db from '../dbConfig.js'
import bcrypt from 'bcrypt-promise'

const saltRounds = 10

//remove asyncs? 11

export const register = async(user) => {
	if(!user.password || !user.name || !user.email) throw new Error('missing field')
	try {
		const pass = await bcrypt.hash(user.password, saltRounds)
		user.password = pass
		const id = await db('users').insert(user, ['id'])
		return id
	} catch (err) {
		console.log(err)
	}
}

export const login = async(name, password) => {
	const user = await findByName(name)
	const valid = await bcrypt.compare(password, user.password)
	if (valid === false) throw new Error(`invalid password for account "${name}"`)
	return db('users')
		.where({ name, password })
		.first()
}

export const findUsers = () => db('users')
	.orderBy('points', 'desc')

export const findUserById = (id) => db('users')
	.where({ id })
	.first()

//select users.id, users.points from users inner join news on users.id=news.userid;
export const findArticleOwner = async(id) => await db('users')
	.join('news', 'news.userid', '=', 'users.id')
	.select('users.id', 'users.points')
	.where('users.id','=',id)
	.first()

export const findByName = (name) => db('users')
	.where({ name })
	.first()


export const remove = async(id) => await db('users')
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

export const editNews = async(id, changes) => {
	await db('news')
		.where({ id })
		.update(changes)
	return findNewsById(id)
}

export const findUserNews = (userid) => db('news')
	.where({ userid })

export const getAllNews = async() => db('news')

export const getNewsFeedback = (newsid) => db('feedback')
	.join('users', 'feedback.userid','=','users.id')
	.select('feedback.comment',
		'feedback.rating',
		'feedback.updated_at',
		'users.name'
	)
	.where({ newsid })
	.orderBy('feedback.updated_at', 'desc')

export const addFeedback = async(feedback) => await db('feedback')
	.insert(feedback, ['id'])
