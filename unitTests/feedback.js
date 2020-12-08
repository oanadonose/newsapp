// import test from 'ava'
// import Feedback from '../modules/feedback.js'

// test('ADD FEEDBACK : successful submit no comment', async test => {
// 	test.plan(1)
// 	const feedback = await new Feedback()
// 	const fakeFeedback = {
// 		newsid: '99',
// 		userid: '99',
// 		rating: 3,
// 	}
// 	try {
// 		const add = await feedback.add(fakeFeedback)
// 		test.is(add, true, 'unable to add news')
// 	} catch (err) {
// 		test.is(err.message, '', 'incorrect error message')
// 	} finally {
// 		feedback.close()
// 	}
// })

// test('ADD FEEDBACK : successful submit with comment', async test => {
// 	test.plan(1)
// 	const feedback = await new Feedback()
// 	const fakeFeedback = {
// 		newsid: '99',
// 		userid: '99',
// 		rating: 3,
// 		comment: 'test comment'
// 	}
// 	try {
// 		const add = await feedback.add(fakeFeedback)
// 		test.is(add, true, 'unable to add news')
// 	} catch (err) {
// 		test.is(err.message, '', 'incorrect error message')
// 	} finally {
// 		feedback.close()
// 	}
// })

// test('ADD FEEDBACK : missing rating', async test => {
// 	test.plan(1)
// 	const feedback = await new Feedback()
// 	const fakeFeedback = {
// 		newsid: '99',
// 		userid: '99',
// 	}
// 	try {
// 		await feedback.add(fakeFeedback)
// 		test.fail('error not thrown')
// 	} catch (err) {
// 		test.is(err.message, 'missing rating', 'incorrect error message')
// 	} finally {
// 		feedback.close()
// 	}
// })

// test('ADD FEEDBACK : missing userid', async test => {
// 	test.plan(1)
// 	const feedback = await new Feedback()
// 	const fakeFeedback = {
// 		newsid: '99',
// 		rating: 3
// 	}
// 	try {
// 		await feedback.add(fakeFeedback)
// 		test.fail('error not thrown')
// 	} catch (err) {
// 		test.is(err.message, 'missing user id', 'incorrect error message')
// 	} finally {
// 		feedback.close()
// 	}
// })

// test('ADD FEEDBACK : missing newsid', async test => {
// 	test.plan(1)
// 	const feedback = await new Feedback()
// 	const fakeFeedback = {
// 		userid: '99',
// 		rating: 3
// 	}
// 	try {
// 		await feedback.add(fakeFeedback)
// 		test.fail('error not thrown')
// 	} catch (err) {
// 		test.is(err.message, 'missing news id', 'incorrect error message')
// 	} finally {
// 		feedback.close()
// 	}
// })
