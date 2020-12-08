import test from 'ava'
import {register} from '../modules/dbHelpers.js'
import db from '../dbConfig.js'
import * as knex from 'knex'

const account1 = {
	name: 'random',
	email: 'random@mail.com',
	password: 'testregister'
}

test.before(async() => {
	await db.migrate.rollback()
	await db.migrate.latest()
})

test.afterEach(async test => {
//   await knex.migrate.rollback()
})


test('REGISTER: register new account', async test => {
	test.plan(1)

	const reg = await register(account1)
	test.deepEqual(reg, [1])
})

test('REGISTER: duplicate email', async test => {
	test.plan(1)
	try {
		const reg = await register(account1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, '')
	}
})
