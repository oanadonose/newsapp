import test from 'ava'
import News from '../modules/news.js'

const dbName = 'website.db'

test('ADD NEW ARTICLE: successfully create a new article', async test => {
	test.plan(1)
	const news = await new News()
	const fakeNews = {
		account: '3',
		title: 'Fake News',
		article: 'This is a fake article.',
		dateAdded: Math.floor(Date.now() / 1000)
	}
	const add = await news.add(fakeNews)
	test.is(add, true, 'unable to add news')
	news.close()
})

test('ADD NEW ARTICLE: missing title field', async test => {
	test.plan(1)
	const news = await new News()
	try {
		await news.add({title:'', article:'test body'})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing title', 'incorrect error message')
	} finally {
		news.close()
	}
})

test('ADD NEW ARTICLE: missing article body', async test => {
	test.plan(1)
	const news = await new News()
	try {
		await news.add({title:'test title',article:''})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing article body', 'incorrect error message')
	} finally {
		news.close()
	}
})
