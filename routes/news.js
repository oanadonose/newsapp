
import Router from 'koa-router'
import News from '../modules/news.js'
import helpers from 'handlebars-helpers'
import nodemailer from 'nodemailer'
import {generateMailOpts} from '../helpers/mail.js'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.user,
		pass: process.env.password
	}
})

const newsRouter = new Router({ prefix: '/news' })

const dbName = 'website.db'

//helpers for hbs
helpers.comparison()

/**
 * Article details page
 *
 * @name Article Page
 * @route {GET} /:newsid
 */
//(\\d+) regexp to enforce number type
newsRouter.get('/:newsid(\\d+)', async ctx => {

	const news = await new News(dbName)
	try{
		//get article info from db
		const article = await news.find(ctx.params.newsid)

		//create owner variable to check in hbs
		const owner = article.userid===ctx.session.userid

		//add article info to hbs
		//add owner property in order to display edit button
		ctx.hbs = { ...ctx.hbs, article, owner}
		console.log(ctx.hbs,'ctx.hbs')
		await ctx.render('article', ctx.hbs)
	} catch (err) {
		console.log('err', err)
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

newsRouter.post('/release/:newsid(\\d+)', async(ctx,next) => {
	const news = await new News(dbName)
	try {
		const article = await news.find(ctx.params.newsid)
		await news.updateStatus(ctx.params.newsid, 'released')
		const mailOpts = generateMailOpts(article, ctx.params.newsid)
		transporter.sendMail(mailOpts, (err, res) => {
			if(err) console.log('err', err)
			else console.log('res', res)
		})
		next()
		return ctx.redirect(`/news/${ctx.params.newsid}?msg=article released`)
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

newsRouter.post('/revise/:newsid(\\d+)', async(ctx,next) => {
	const news = await new News(dbName)
	console.log('in revised route')
	try {
		await news.updateStatus(ctx.params.newsid, 'pending')
		console.log('ctx.hbs', ctx.hbs)
		next()
		return ctx.redirect(`/news/${ctx.params.newsid}?msg=article marked for revision`)
	} catch(err) {
		console.log('err', err)
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

newsRouter.get('/add', async ctx => {
	try {
		console.log(ctx.hbs)
		if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/news')
		await ctx.render('add', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

newsRouter.post('/add', async ctx => {
	const news = await new News(dbName)
	try {
		ctx.request.body.account = ctx.session.userid
		if(ctx.request.files.photo.name) {
			ctx.request.body.filePath = ctx.request.files.photo.path
			ctx.request.body.fileName = ctx.request.files.photo.name
			ctx.request.body.fileType = ctx.request.files.photo.type
		}
		await news.add(ctx.request.body)
		return ctx.redirect('/?msg=new article added')
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('index', ctx.hbs)
	} finally {
		news.close()
	}
})

newsRouter.get('/add/:newsid(\\d+)', async ctx => {
	const news = await new News(dbName)
	try {
		const article = await news.find(ctx.params.newsid)
		ctx.hbs = {...ctx.hbs, article}
		await ctx.render('add', ctx.hbs)
	} catch(err) {
		console.log(err, 'err')
		await ctx.render('error', ctx.hbs)
	}
})

newsRouter.post('/add/:newsid(\\d+)', async ctx => {
	const news = await new News(dbName)
	try {
		if(ctx.request.files.photo.name) {
			ctx.request.body.filePath = ctx.request.files.photo.path
			ctx.request.body.fileName = ctx.request.files.photo.name
			ctx.request.body.fileType = ctx.request.files.photo.type
		}
		ctx.request.body.newsid = ctx.params.newsid
		await news.edit(ctx.request.body)
		return ctx.redirect('/?msg=article edited successfully')
	} catch(err) {
    	console.log('err', err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

newsRouter.get('/pending', async ctx => {
	const news = await new News(dbName)
	try {
		const pendingArticles = await news.all('pending')
		console.log('ctx.hbs1', ctx.hbs)
		ctx.hbs = {...ctx.hbs, news: pendingArticles}
		console.log('ctx.hbs2', ctx.hbs)
		await ctx.render('pending', ctx.hbs)
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

export { newsRouter }
