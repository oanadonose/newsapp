import Router from 'koa-router'
import Accounts from '../modules/accounts.js'
import Feedback from '../modules/feedback.js'
import News from '../modules/news.js'

export const feedbackRouter = new Router({ prefix: '/feedback' })

const dbName = 'website.db'

feedbackRouter.post('/:newsid(\\d+)', async ctx => {
	const news = await new News(dbName)
	const feedback = await new Feedback(dbName)
	const accounts = await new Accounts(dbName)
	const article = await news.find(ctx.params.newsid)
	const articleUser = article.userid
	const newFeedback = {
		userid: ctx.hbs.userid,
		newsid: ctx.params.newsid,
		rating: ctx.request.body.rating,
		comment: ctx.request.body.comment
	}
	try {
		await feedback.add(newFeedback)
		await accounts.addPoints(articleUser, parseInt(ctx.request.body.rating))
		return ctx.redirect(`/news/${ctx.params.newsid}`)
	} catch (err) {
		await ctx.render('error', ctx.hbs)
	}
})


//feedbackRouter.get('/:newsid(\\d+)', async ctx => {
//	const feedback = await new Feedback(dbName)
//	try {
//		const feedback = await feedback.getByNewsId(ctx.params.newsid)

//		ctx.hbs = { ...ctx.hbs, feedback }
//	} catch (err) {
//		console.log('err', err)
//		await ctx.render('error', ctx.hbs)
//	} finally {
//		feedback.close()
//	}
//})
