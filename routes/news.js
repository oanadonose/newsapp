import Router from 'koa-router'
import helpers from 'handlebars-helpers'
import nodemailer from 'nodemailer'
import { generateMailOpts } from '../helpers/mail.js'
import { addNews, findNewsById, findNewsByStatus, findUserById,
	editNews, editUser, getNewsFeedback } from '../modules/dbHelpers.js'
import mime from 'mime-types'
import fs from 'fs-extra'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.user,
		pass: process.env.password
	}
})

const newsRouter = new Router({ prefix: '/news' })

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
	try {
		let article = await findNewsById(ctx.params.newsid)
		const articleOwner = await findUserById(article.userid)
		article = { ... article, user: articleOwner.name }

		//create owner variable to check in hbs
		const owner = article.userid === ctx.session.userid
		//find article feedback
		const feedbackItems = await getNewsFeedback(ctx.params.newsid)
		console.log('feedbackItems', feedbackItems)
		//add article info to hbs
		//add owner property in order to display edit button
		ctx.hbs = { ...ctx.hbs, article, owner, feedbackItems}
		await ctx.render('article', ctx.hbs)
	} catch (err) {
		ctx.hbs.msg = err.message
		console.log('err', err)
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * Route to release admin reviewed articles.
 *
 * @name Home Page
 * @route {POST} /news/release/:newsid
 */
newsRouter.post('/release/:newsid(\\d+)', async(ctx, next) => {
	try {
		let article = await findNewsById(ctx.params.newsid)
		const changes = { status: 'released' }
		await editNews(ctx.params.newsid, changes)
		const user = await findUserById(article.userid)
		const userUpdates = {	points: user.points + articleReleasedPts }
		await editUser(article.userid, userUpdates)
		article = { ...article, email: user.email }
		const mailOpts = generateMailOpts(article, ctx.params.newsid)
		transporter.sendMail(mailOpts, (err, res) => {
			if (err) console.log('err', err)
			else console.log('res', res)
		})
		next()
		return ctx.redirect(`/news/${ctx.params.newsid}?msg=article released`)
	} catch (err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * Route to mark for revision admin reviewed articles.
 *
 * @name Home Page
 * @route {POST} /news/revise/:newsid
 */
newsRouter.post('/revise/:newsid(\\d+)', async(ctx) => {
	try {
		const changes = {
			status: 'revision'
		}
		await editNews(ctx.params.newsid, changes)
		return ctx.redirect(`/news/${ctx.params.newsid}?msg=article marked for revision`)
	} catch (err) {
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	}
})


/**
 * Route to delete articles.
 *
 * @name Home Page
 * @route {POST} /news/delete/:newsid
 */
newsRouter.post('/delete/:newsid(\\d+)', async(ctx) => {
	try {
		const changes = {
			status: 'archived'
		}
		await editNews(ctx.params.newsid, changes)
		return ctx.redirect(`/news/${ctx.params.newsid}?msg=article archived`)
	} catch (err) {
		console.log('err', err)
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
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
	let filename='image_2.jpg'
	try {
		ctx.request.body.account = ctx.session.userid
		if (ctx.request.files.photo.name) {
			ctx.request.body.filePath = ctx.request.files.photo.path
			ctx.request.body.fileName = ctx.request.files.photo.name
			ctx.request.body.fileType = ctx.request.files.photo.type
			filename = `${Date.now()}.${mime.extension(ctx.request.files.photo.type)}`
			await fs.copy(ctx.request.files.photo.path, `public/images/${filename}`)
		}
		const newsInfo = {
			title: ctx.request.body.title,
			userid: ctx.request.body.account,
			article: ctx.request.body.article,
			photo: filename
		}
		await addNews(newsInfo.userid, newsInfo)
		const user = await findUserById(newsInfo.userid)
		const userPoints = user.points
		const userUpdates = {
			points: userPoints + articleAddedPts
		}
		await editUser(newsInfo.userid, userUpdates)
		return ctx.redirect('/?msg=new article added')
	} catch (err) {
		ctx.hbs.msg = err.message
		await ctx.render('index', ctx.hbs)
	}
})

/**
 * Edit news article page.
 *
 * @name Edit Page
 * @route {GET} /news/add/:newsid
 */
newsRouter.get('/add/:newsid(\\d+)', async ctx => {
	try {
		const article = await findNewsById(ctx.params.newsid)
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
	let filename
	try {
		ctx.request.body.account = ctx.session.userid
		if (ctx.request.files.photo.name) {
			ctx.request.body.filePath = ctx.request.files.photo.path
			ctx.request.body.fileName = ctx.request.files.photo.name
			ctx.request.body.fileType = ctx.request.files.photo.type
			filename = `${Date.now()}.${mime.extension(ctx.request.files.photo.type)}`
			await fs.copy(ctx.request.files.photo.path, `public/images/${filename}`)
		}
		let changes = {
			title: ctx.request.body.title,
			article: ctx.request.body.article,
		}
		if(filename) {
			changes = {...changes, photo: filename}
		}
		await editNews(ctx.params.newsid, changes)
		return ctx.redirect('/?msg=article edited successfully')
	} catch (err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * Pending articles page
 *
 * @name Pending Page
 * @route {GET} /news/pending
 */
newsRouter.get('/pending', async ctx => {
	try {
		const pendingArticles = await findNewsByStatus('pending')
		ctx.hbs = { ...ctx.hbs, news: pendingArticles }
		await ctx.render('pending', ctx.hbs)
	} catch (err) {
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * Pending articles page
 *
 * @name Pending Page
 * @route {GET} /news/pending
 */
newsRouter.get('/revision', async ctx => {
	try {
		const pendingArticles = await findNewsByStatus('revision')
		ctx.hbs = { ...ctx.hbs, news: pendingArticles }
		await ctx.render('pending', ctx.hbs)
	} catch (err) {
		await ctx.render('error', ctx.hbs)
	}
})

export { newsRouter }
