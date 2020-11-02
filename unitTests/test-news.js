import test from 'ava'
import News from '../modules/news.js'

const dbName = 'website.db'

test('ADD NEW ARTICLE', async test => {
	test.plan(1)
	const news = await new News(dbName)
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
