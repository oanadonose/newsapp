import db from '../dbConfig.js'
import bcrypt from 'bcrypt-promise'

const saltRounds = 10

export const validate = async(user) => {
	if(!user.password || !user.name || !user.email) return false
	const findUser = await findUserByEmail(user.email)
	if(findUser) return false
	return true
}
export const register = async(user) => {
	const isvalid = await validate(user)
	if(!isvalid) throw new Error('could not validate user')
	try {
		const pass = await bcrypt.hash(user.password, saltRounds)
		user.password = pass
		const id = await db('users').insert(user, ['id'])
		return findUserById(id[0])
	} catch (err) {
		console.log(err)
		throw new Error('sql error')
	}
}

export const findByName = async(name) => await db('users')
	.where({ name })
	.select('id','name','email','password','admin')
	.first()

export const login = async(name, password) => {
	const user = await findByName(name)
	if(!user) throw new Error('invalid user name')
	const valid = await bcrypt.compare(password, user.password)
	if (valid === false) throw new Error('invalid password')
	return true
}

export const findUsers = async() => await db('users')
	.orderBy('points', 'desc')

export const findUserById = async(id) => await db('users')
	.where({ id })
	.select('id','name','email','points')
	.first()

//select users.id, users.points from users inner join news on users.id=news.userid where news.id=id;
export const findUserByNews = async(id) => await db('news')
	.join('users', 'users.id','=','news.userid')
	.select('users.id','users.points')
	.where('news.id','=',id)
	.first()

export const findUserByEmail = async(email) => await db('users')
	.where({ email })
	.first()

export const getSubscribedUsers = async() => await db('users')
	.where('subscribed','=',1)
	.select('email','name','id')

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
	.orderBy('updated_at','desc')

export const addNews = async(userid, news) => {
	if(!news.title || !news.article || !news.photo) throw new Error('missing field')
	return await db('news')
		.where({ userid })
		.insert(news, ['id'])
}

export const editNews = async(id, changes) => {
	await db('news')
		.where({ id })
		.update(changes)
	return findNewsById(id)
}

export const findUserNews = async(userid) => await db('news')
	.where({ userid })

export const getAllNews = async() => db('news').orderBy('updated_at','desc')

export const getNewsFeedback = (newsid) => db('feedback')
	.join('users', 'feedback.userid','=','users.id')
	.select('feedback.comment',
		'feedback.rating',
		'feedback.updated_at',
		'users.name'
	)
	.where({ newsid })
	.orderBy('feedback.updated_at', 'desc')

export const addFeedback = async(feedback) => {
	if(!feedback.rating) throw new Error('missing rating')
	return await db('feedback')
		.insert(feedback, ['id'])
}
