
import Router from 'koa-router'
import bodyParser from 'koa-body'
import { register, find, findById, remove, update, addNews, getAllNews, findByName, login } from '../modules/dbHelpers.js'

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
	try {
    const newsArticles = await getAllNews()
		//const newsArticles = await news.all()
		//const leaders = await accounts.getUserLeaderboards()
		ctx.hbs = { ...ctx.hbs, news: newsArticles}
    console.log(ctx.hbs)
		await ctx.render('index', ctx.hbs)
	} catch (err) {
    console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})


publicRouter.get('/db', async ctx => {
  try {
//       const userInfo = {
//         name: 'test',
//         password: ''
//       } 
//       await register(userInfo)
//     const users = await remove(2)
    
//     ctx.hbs = {...ctx.hbs, users}
//     console.log(ctx.hbs, 'ctx.hbs')
//     const changes= {
//       title: 'testss222',
//       userid: 1
//     }
//     const res = await addNews(1, changes)
//     console.log(res,'res')
    await ctx.render('index',ctx.hbs)
  } catch (err) {
    console.log(err)
    await ctx.render('error', ctx.hbs)
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
	try {
    const userInfo = {
      name: ctx.request.body.user,
      password: ctx.request.body.pass,
      email: ctx.request.body.email,
      subscribed: ctx.request.body.subscribed=='on' ? 1:0
    }
		const res = await register(userInfo)
    if(res==0) {
      ctx.redirect(`/login?msg=missing field error`)
    }
		else {
      ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
    }
	} catch (err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		await ctx.render('register', ctx.hbs)
	}
})
// /**
//  * The new user validation page.
//  *
//  * @name Postregister Page
//  * @route {GET} /postregister
//  */
// publicRouter.get('/postregister', async ctx => await ctx.render('validate'))

// /**
//  * The script to validate new user registrations.
//  *
//  * @name Validate Script
//  * @route {GET} /validate/:user/:token
//  */
// publicRouter.get('/validate/:user/:token', async ctx => {
// 	try {
// 		console.log('VALIDATE')
// 		console.log(`URL --> ${ctx.request.url}`)
// 		if (!ctx.request.url.includes('.css')) {
// 			console.log(ctx.params)
// 			const milliseconds = 1000
// 			const now = Math.floor(Date.now() / milliseconds)
// 			const account = await new Accounts(dbName)
// 			await account.checkToken(ctx.params.user, ctx.params.token, now)
// 			ctx.hbs.msg = `account "${ctx.params.user}" has been validated`
// 			await ctx.render('login', ctx.hbs)
// 		}
// 	} catch (err) {
// 		await ctx.render('login', ctx.hbs)
// 	}
// })

/**
 * The login page.
 *
 * @name Login Page
 * @route {GET} /login
 */
publicRouter.get('/login', async ctx => {
	await ctx.render('login', ctx.hbs)
})

/**
 * The login script.
 *
 * @name Login Script
 * @route {POST} /login
 */
publicRouter.post('/login', async ctx => {
	try {
		const body = ctx.request.body
    console.log({body})
		const user = await findByName(body.user)

    if(!user) {
      return ctx.redirect(`/login?msg=invalid user name`)
    }
    else {
      const checkLogin = await login(body.user, body.pass)
    }
		ctx.session.authorised = true
		ctx.session.user = body.user
		ctx.session.userid = user.id
		ctx.session.admin = user.admin
		const referrer = body.referrer || '/'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch (err) {
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	}
})

/**
 * The logout script.
 *
 * @name Logout Script
 * @route {POST} /logout
 */
publicRouter.get('/logout', async ctx => {
	ctx.session.authorised = null
	//delete cookies
	delete ctx.session.user
	delete ctx.session.userid
	delete ctx.session.admin
	ctx.redirect('/?msg=you are now logged out')
})

export { publicRouter }
