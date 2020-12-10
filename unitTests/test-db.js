import test from 'ava'
import { register, login } from '../modules/dbHelpers.js'
import db from '../dbConfig.js'

const account1 = {
	name: 'random',
	email: 'random@mail.com',
	password: 'testregister'
}
const account2 = {
	name: 'random2',
	email: 'random2@mail.com',
	password: 'testregister2'
}

//refresh data in test db before test suite starts
test.before(async() => {
	await db.migrate.rollback()
	await db.migrate.latest()
	console.log('refresh db')
})

// test.beforeEach(async() => {
//   await db.migrate.rollback()
// 	await db.migrate.latest()
// })

// //delete users data after each test
test.afterEach(async() => {
	await db('users').truncate()
})

test.after(async() => {
	await db.migrate.rollback()
	await db.migrate.latest()
})

test('REGISTER: register new account', async test => {
	test.plan(1)
	const expect = {
		id: 1,
		name: account1.name,
		email: account1.email,
		points: 0
	}
	const reg = await register(account1)
	test.deepEqual(reg, expect, 'unable to register')
})

test('REGISTER: duplicate email', async test => {
	test.plan(1)
	try {
		await register({email: 'test@mail.com',name: 'testtt',password: 'testtt'})
		await register({email: 'test@mail.com',name: 'testtt',password: 'testtt'})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'could not validate user')
	}
})

test('REGISTER: error if blank name', async test => {
	test.plan(1)
	try {
		await register({name: '', email: account1.email, password: account1.password})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'could not validate user', 'incorrect error message')
	}
})

test('REGISTER: error if blank email', async test => {
	test.plan(1)
	try {
		await register({name: account1.name, email: '', password: account1.password})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'could not validate user', 'incorrect error message')
	}
})

test('REGISTER: error if blank password', async test => {
	test.plan(1)
	try {
		await register({name: account1.name, email: account1.email, password: ''})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'could not validate user', 'incorrect error message')
	}
})


test('LOGIN: success', async test => {
	test.plan(1)
	const pass = account2.password
	await register(account2)
	const res = await login(account2.name, pass)
	test.is(res, true, 'fail')
})

test('LOGIN: invalid username', async test => {
	test.plan(1)
	try {
		await login('test', 'test')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'invalid user name', 'incorrect error message')
	}
})

test('LOGIN: invalid password', async test => {
	test.plan(1)
	try {
		await register(account2)
		await login(account2.name, 'test')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'invalid password', 'incorrect error message')
	}
})
