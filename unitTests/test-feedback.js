import test from 'ava'
import {addFeedback} from '../modules/dbHelpers.js'
import db from '../dbConfig.js'

const feedback = {
	userid: 1,
	newsid: 1,
	rating: 2,
	comment: 'great!'
}

const feedback2 = {
	userid: 2,
	newsid: 1,
	comment: 'meh'
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
	await db('news').insert([
		{ title: 'Test1', article: 'test1', photo: 'test1.jpg', userid: 1 },
		{ title: 'Test2', article: 'test2', photo: 'test2.jpg', userid: 2 }
	])
})

test.afterEach(async() => {
	await db('feedback').truncate()
})

test('ADD FEEDBACK: success', async test => {
	test.plan(1)
	const res = await addFeedback(feedback)
	test.deepEqual(res, [1], 'incorrect')
})

test('ADD FEEDBACK: missing rating', async test => {
	test.plan(1)
	try {
		await addFeedback(feedback2)
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'missing rating', 'incorrect')
	}
})
