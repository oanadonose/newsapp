import Router from 'koa-router'
import News from '../modules/news.js'
import Accounts from '../modules/accounts.js'
import Feedback from '../modules/feedback.js'
import helpers from 'handlebars-helpers'
import nodemailer from 'nodemailer'
import { generateMailOpts } from '../helpers/mail.js'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.user,
		pass: process.env.password
	}
})

const newsRouter = new Router({ prefix: '/news' })

const dbName = 'website.db'

const articleAddedPts = 10
const articleReleasedPts = 15

//helpers for hbs
helpers.comparison()

/**
 * Article details page
 *
 * @name Article Page
 * @route {GET} /news/:newsid
 */
//(\\d+) regexp to enforce number type
newsRouter.get('/:newsid(\\d+)', async ctx => {

	const news = await new News(dbName)
	const feedback = await new Feedback(dbName)
	try {
		//get article info from db
		const article = await news.find(ctx.params.newsid)
		//create owner variable to check in hbs
		const owner = article.userid === ctx.session.userid
		//find article feedback
		const feedbackItems = await feedback.getByNewsId(ctx.params.newsid)
		//add article info to hbs
		//add owner property in order to display edit button
		ctx.hbs = { ...ctx.hbs, article, owner, feedbackItems }
		await ctx.render('article', ctx.hbs)
	} catch (err) {
		console.log('err', err)
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

/**
 * Route to release admin reviewed articles.
 *
 * @name Home Page
 * @route {POST} /news/release/:newsid
 */
newsRouter.post('/release/:newsid(\\d+)', async(ctx, next) => {
	const news = await new News(dbName)
	const accounts = await new Accounts(dbName)
	try {
		const article = await news.find(ctx.params.newsid)
		await news.updateStatus(ctx.params.newsid, 'released')
		await accounts.addPoints(article.userid, articleReleasedPts) //15
		const mailOpts = generateMailOpts(article, ctx.params.newsid)
		transporter.sendMail(mailOpts, (err, res) => {
			if (err) console.log('err', err)
			else console.log('res', res)
		})
		next()
		return ctx.redirect(`/news/${ctx.params.newsid}?msg=article released`)
	} catch (err) {
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

/**
 * Route to delete articles.
 *
 * @name Home Page
 * @route {POST} /news/delete/:newsid
 */
newsRouter.post('/delete/:newsid(\\d+)', async(ctx) => {
	const news = await new News(dbName)
	try {
		await news.updateStatus(ctx.params.newsid, 'archived')
		return ctx.redirect('/?msg=article deleted')
	} catch (err) {
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

/**
 * Route to mark for revision admin reviewed articles.
 *
 * @name Home Page
 * @route {POST} /news/revise/:newsid
 */
newsRouter.post('/revise/:newsid(\\d+)', async(ctx, next) => {
	const news = await new News(dbName)
	console.log('in revised route')
	try {
		await news.updateStatus(ctx.params.newsid, 'pending')
		next()
		return ctx.redirect(`/news/${ctx.params.newsid}?msg=article marked for revision`)
	} catch (err) {
		console.log('err', err)
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

/**
 * Render Add new article page.
 *
 * @name AddArticle Page
 * @route {GET} /news/add
 */
newsRouter.get('/add', async ctx => {
	try {
		if (ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/news')
		await ctx.render('add', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * Add new article script.
 *
 * @name AddNews Script
 * @route {POST} /news/add
 */
newsRouter.post('/add', async ctx => {
	const news = await new News(dbName)
	const accounts = await new Accounts(dbName)
	try {
		ctx.request.body.account = ctx.session.userid
		if (ctx.request.files.photo.name) {
			ctx.request.body.filePath = ctx.request.files.photo.path
			ctx.request.body.fileName = ctx.request.files.photo.name
			ctx.request.body.fileType = ctx.request.files.photo.type
		}
		await news.add(ctx.request.body)
		await accounts.addPoints(ctx.session.userid, articleAddedPts) //10
		return ctx.redirect('/?msg=new article added')
	} catch (err) {
		ctx.hbs.msg = err.message
		await ctx.render('index', ctx.hbs)
	} finally {
		news.close()
	}
})

/**
 * Edit news article page.
 *
 * @name Edit Page
 * @route {GET} /news/add/:newsid
 */
newsRouter.get('/add/:newsid(\\d+)', async ctx => {
	const news = await new News(dbName)
	try {
		const article = await news.find(ctx.params.newsid)
		ctx.hbs = { ...ctx.hbs, article }
		await ctx.render('add', ctx.hbs)
	} catch (err) {
		console.log(err, 'err')
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * Edit news article script.
 *
 * @name Edit Script
 * @route {POST} /news/add/:newsid
 */
newsRouter.post('/add/:newsid(\\d+)', async ctx => {
	const news = await new News(dbName)
	try {
		if (ctx.request.files.photo.name) {
			ctx.request.body.filePath = ctx.request.files.photo.path
			ctx.request.body.fileName = ctx.request.files.photo.name
			ctx.request.body.fileType = ctx.request.files.photo.type
		}
		ctx.request.body.newsid = ctx.params.newsid
		await news.edit(ctx.request.body)
		return ctx.redirect('/?msg=article edited successfully')
	} catch (err) {
		console.log('err', err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

/**
 * Pending articles page
 *
 * @name Pending Page
 * @route {GET} /news/pending
 */
newsRouter.get('/pending', async ctx => {
	const news = await new News(dbName)
	try {
		const pendingArticles = await news.all('pending')
		ctx.hbs = { ...ctx.hbs, news: pendingArticles }
		await ctx.render('pending', ctx.hbs)
	} catch (err) {
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

export { newsRouter }
