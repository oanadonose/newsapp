import test from 'ava'
import {addNews, findNewsById, editNews} from '../modules/dbHelpers.js'
import db from '../dbConfig.js'

//.returning() is necessary for postgres in production

const news = {
	title: 'Test title',
	article: 'test article',
	photo: 'test.jpg',
	userid: 1
}

//refresh data in test db before test suite starts
test.before(async() => {
	await db.migrate.rollback()
	await db.migrate.latest()
	console.log('refresh db')
	await db('users').insert([
		{ name: 'test1', email: 'test1@mail.com', password: 'test1' },
		{ name: 'test2', email: 'test2@mail.com', password: 'test2' },
		{ name: 'testadmin', email: 'testadmin@mail.com', password: 'testadmin', admin: 1 }
	])
	console.log('add users data')
})


test.afterEach(async() => {
	await db('news').truncate()
})


test('ADD ARTICLE: success', async test => {
	test.plan(1)
	const res = await addNews(news.userid, news)
	test.deepEqual(res,[1],'incorrect')
})

test('ADD ARTICLE: missing title', async test => {
	test.plan(1)
	try{
		await addNews(news.userid,
			{
				title: '',
				article: news.article,
				photo: news.photo,
				userid: news.userid
			})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message,'missing field','incorrect error')
	}
})

test('ADD ARTICLE: missing article', async test => {
	test.plan(1)
	try{
		await addNews(news.userid, {title: news.title,article: '', photo: news.photo, userid: news.userid})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message,'missing field','incorrect error')
	}
})

test('ADD ARTICLE: missing photo', async test => {
	test.plan(1)
	try{
		await addNews(news.userid, {
			title: news.title,
			article: news.article,
			photo: '',
			userid: news.userid
		})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message,'missing field','incorrect error')
	}
})

test('FIND NEWS BY ID: find', async test => {
	test.plan(3)
	await addNews(news.userid, news)
	const res = await findNewsById(1)
	test.is(res.title, news.title, 'incorrect')
	test.is(res.article, news.article, 'incorrect')
	test.is(res.userid, news.userid, 'incorrect')
})

test('EDIT NEWS: title edit success', async test => {
	test.plan(1)
	await addNews(news.userid, news)
	const res = await editNews(1, {title: 'new title'})
	test.is(res.title, 'new title' , 'incorrect')
})

test('EDIT NEWS: article edit success', async test => {
	test.plan(1)
	await addNews(news.userid, news)
	const res = await editNews(1, {article: 'new article'})
	test.is(res.article, 'new article' , 'incorrect')
})

test('EDIT NEWS: photo edit success', async test => {
	test.plan(1)
	await addNews(news.userid, news)
	const res = await editNews(1, {photo: 'new photo'})
	test.is(res.photo, 'new photo' , 'incorrect')
})

test('EDIT NEWS: change status', async test => {
	test.plan(1)
	await addNews(news.userid, news)
	const res = await editNews(1, {status: 'tested'})
	test.is(res.status, 'tested', 'incorrect')
})
