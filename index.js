
import Koa from 'koa'
import views from 'koa-views'
import serve from 'koa-static'
import session from 'koa-session'
import nodemailer from 'nodemailer'

import { apiRouter } from './routes/routes.js'

import cron from 'node-cron'
import { subscriptionMailOpts } from './helpers/mail.js'
import { getSubscribedUsers, getAllNews } from './modules/dbHelpers.js'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.user,
		pass: process.env.password
	}
})

//every day at midnight task
//-note won't work on heroku unless app is pinged around this time
////-apps sleep after inactivity
//cron args {minute hour day(month) month day(week)}
cron.schedule('0 0 * * *', async() => {
	const count = 7
	console.log('cron')
	//get subscribed users from db
	const subscribedUsers = await getSubscribedUsers()
	console.log('subscribedUsers',subscribedUsers)
	//get top 3 news from db
	const topNews = await getAllNews()
	console.log('topNews',topNews)
	//generate email and send
	subscribedUsers.forEach(subscribedUser => {
		const mailOpts = subscriptionMailOpts(subscribedUser, topNews, count)
		transporter.sendMail(mailOpts, (err, res) => {
			if (err) console.log('err', err)
			else console.log('res', res)
		})
	})
})

const app = new Koa()
app.keys = ['darkSecret']

const defaultPort = 5000
const port = process.env.PORT || defaultPort

app.use(serve('public'))
app.use(session(app))
app.use(views('views',
	{
		extension: 'handlebars',
		map: { hbs: 'handlebars' },
		options: {
			helpers: {
				format: (dateStr) => {
					const date = new Date(dateStr)
					return new Intl.DateTimeFormat().format(date)
				}
			}
		}
	}
))

app.use(async(ctx, next) => {
	console.log(`${ctx.method} ${ctx.path}`)
	ctx.hbs = {
		authorised: ctx.session.authorised,
		user: ctx.session.user,
		userid: ctx.session.userid,
		admin: ctx.session.admin,
		host: `https://${ctx.host}`
	}
	for (const key in ctx.query) ctx.hbs[key] = ctx.query[key]
	await next()
})

app.use(apiRouter.routes(), apiRouter.allowedMethods())

app.listen(port, '0.0.0.0', async() => console.log(`listening on port ${port}`))
