
import Router from 'koa-router'

import { publicRouter } from './public.js'
import { newsRouter } from './news.js'
import { feedbackRouter } from './feedback.js'

const apiRouter = new Router()

const nestedRoutes = [publicRouter, newsRouter, feedbackRouter]
for (const router of nestedRoutes) apiRouter.use(router.routes(), router.allowedMethods())

export { apiRouter }
