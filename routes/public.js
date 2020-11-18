
import Router from 'koa-router'
import bodyParser from 'koa-body'

const publicRouter = new Router()
publicRouter.use(bodyParser({ multipart: true }))

import Accounts from '../modules/accounts.js'
import News from '../modules/news.js'
const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
publicRouter.get('/', async ctx => {
	const news = await new News(dbName)
	const accounts = await new Accounts(dbName)
	try {
		const newsArticles = await news.all()
		console.log('before leaders')
		const leaders = await accounts.getUserLeaderboards()
		console.log(leaders, 'leaders')
		ctx.hbs = { ...ctx.hbs, news: newsArticles, leaders }
		await ctx.render('index', ctx.hbs)
	} catch (err) {
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
publicRouter.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
publicRouter.post('/register', async ctx => {
	const account = await new Accounts(dbName)
	try {
		// call the functions in the module
    console.log(ctx.request.body)
		await account.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email, ctx.request.body.subscribed)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch (err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		account.close()
	}
})

publicRouter.get('/postregister', async ctx => await ctx.render('validate'))

publicRouter.get('/validate/:user/:token', async ctx => {
	try {
		console.log('VALIDATE')
		console.log(`URL --> ${ctx.request.url}`)
		if (!ctx.request.url.includes('.css')) {
			console.log(ctx.params)
			const milliseconds = 1000
			const now = Math.floor(Date.now() / milliseconds)
			const account = await new Accounts(dbName)
			await account.checkToken(ctx.params.user, ctx.params.token, now)
			ctx.hbs.msg = `account "${ctx.params.user}" has been validated`
			await ctx.render('login', ctx.hbs)
		}
	} catch (err) {
		await ctx.render('login', ctx.hbs)
	}
})

publicRouter.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

publicRouter.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		const user = await account.login(body.user, body.pass)
		const id = user.id
		ctx.session.authorised = true
		ctx.session.user = body.user
		ctx.session.userid = id
		ctx.session.admin = user.admin
		const referrer = body.referrer || '/'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch (err) {
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		account.close()
	}
})

publicRouter.get('/logout', async ctx => {
	ctx.session.authorised = null
	//delete cookies
	delete ctx.session.user
	delete ctx.session.userid
	delete ctx.session.admin
	ctx.redirect('/?msg=you are now logged out')
})

export { publicRouter }
