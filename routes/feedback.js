import Router from 'koa-router'
import Feedback from '../modules/feedback.js'

export const feedbackRouter = new Router({ prefix: '/feedback' })

const dbName = 'website.db'

feedbackRouter.post('/:newsid(\\d+)', async ctx => {
	const feedback = await new Feedback(dbName)
	console.log(ctx.request.body, 'ctx.body')
	const newFeedback = {
		userid: ctx.hbs.userid,
		newsid: ctx.params.newsid,
		rating: ctx.request.body.rating,
		comment: ctx.request.body.comment
	}
	try {
		await feedback.add(newFeedback)
		return ctx.redirect(`/news/${ctx.params.newsid}`)
	} catch (err) {
		console.log('err', err)
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