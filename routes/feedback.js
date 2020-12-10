import Router from 'koa-router'
import { addFeedback, findUserByNews, editUser } from '../modules/dbHelpers.js'

export const feedbackRouter = new Router({ prefix: '/feedback' })


/**
 * Post new feedback item Script
 *
 * @name Post Feedback Script
 * @route {POST} /feedback/:newsid
 */
feedbackRouter.post('/:newsid(\\d+)', async ctx => {
	const newFeedback = {
		userid: ctx.hbs.userid,
		newsid: ctx.params.newsid,
		rating: ctx.request.body.rating,
		comment: ctx.request.body.comment
	}
	const articleOwner = await findUserByNews(newFeedback.newsid)
	try {
		await addFeedback(newFeedback)
		const updates = {
			points: articleOwner.points + parseInt(newFeedback.rating)
		}
		await editUser(articleOwner.id, updates)
		return ctx.redirect(`/news/${ctx.params.newsid}?msg=feedback added`)
	} catch(err) {
		console.log('err',err)
		await ctx.render('error', ctx.hbs)
	}
})

