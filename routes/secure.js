
import Router from 'koa-router'
import News from '../modules/news.js'


const secureRouter = new Router({ prefix: '/secure' })

const dbName = 'website.db'

secureRouter.get('/', async ctx => {
	try {
		console.log(ctx.hbs)
		if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
		await ctx.render('secure', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

secureRouter.post('/add', async ctx => {
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
		console.log('err', err)
		await ctx.render('error', ctx.hbs)
	} finally {
		news.close()
	}
})

export { secureRouter }
