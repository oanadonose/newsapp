import test from 'ava'
import News from '../modules/news.js'

test('ADD NEW ARTICLE: successfully create a new article', async test => {
	test.plan(1)
	const news = await new News()
	const fakeNews = {
		account: '3',
		title: 'Fake News',
		article: 'This is a fake article.',
		dateAdded: Math.floor(Date.now() / 1000)
	}
	try {
		const add = await news.add(fakeNews)
		test.is(add, true, 'unable to add news')
	} catch(err) {
		test.is(err.message, '' , 'incorrect error message')
	} finally {
		news.close()
	}


})

test('ADD NEW ARTICLE: missing title field', async test => {
	test.plan(1)
	const news = await new News()
	try {
		await news.add({title: '', article: 'test body'})
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
		await news.add({title: 'test title',article: ''})
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing article body', 'incorrect error message')
	} finally {
		news.close()
	}
})

test('EDIT ARTICLE: succesfully edit article', async test => {
	test.plan(1)
	const news = await new News()
	const updated = {
		title: 'update test',
		article: 'update test',
		photo: 'update.jpeg',
		newsid: '1'
	}
	try {
		const edit = await news.edit(updated)
		test.is(edit, true, 'unable to add news')
	} catch(err) {
		test.is(err.message, 'test', 'incorrect error message')
	} finally {
		news.close()
	}
})

test('EDIT ARTICLE: missing article title', async test => {
	test.plan(1)
	const news = await new News()
	const updated = {
		title: '',
		article: 'update test',
		photo: 'update.jpeg',
		newsid: '1'
	}
	try {
		await news.edit(updated)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing title', 'inocrrect error message')
	} finally {
		news.close()
	}
})

test('EDIT ARTICLE: missing article body', async test => {
	test.plan(1)
	const news = await new News()
	const updated = {
		title: 'Test',
		article: '',
		photo: 'update.jpeg',
		newsid: '1'
	}
	try {
		await news.edit(updated)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing article body', 'inocrrect error message')
	} finally {
		news.close()
	}
})

test('DELETE ARTICLE: successfully delete', async test => {
	test.plan(1)
	const news = await new News()
	try {
		const remove = await news.updateStatus('1', 'archived')
		test.is(remove, true, 'unable to delete news')
	} catch (err) {
		test.is(err.message, 'test', 'incorrect error message')
	} finally {
		news.close()
	}
})
