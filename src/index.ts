require('newrelic')
require('module-alias/register')
require('dotenv').config()
// external
import * as Sentry from '@sentry/node'
import { ApolloServer, GraphQLOptions } from 'apollo-server'
import express from 'express'
import costAnalysis from 'graphql-cost-analysis'
import depthLimit from 'graphql-depth-limit'
// internal
import logger from 'common/logger'
import { UPLOAD_FILE_SIZE_LIMIT } from 'common/enums'
import { environment, isProd } from 'common/environment'
import { DataSources } from 'definitions'
import { makeContext, initSubscriptions } from 'common/utils'
import scheduleQueue from 'connectors/queue/schedule'
import {
  ArticleService,
  CommentService,
  DraftService,
  SystemService,
  TagService,
  UserService,
  NotificationService
} from 'connectors'
import { ActionLimitExceededError } from 'common/errors'

// local
import schema from './schema'
import costMap from './costMap'

// start Sentry
Sentry.init({ dsn: environment.sentryDsn || '' })

// start schedule jobs
scheduleQueue.start()

class ProtectedApolloServer extends ApolloServer {
  async createGraphQLServerOptions(
    req: express.Request,
    res: express.Response
  ): Promise<GraphQLOptions> {
    const options = await super.createGraphQLServerOptions(req, res)
    const maximumCost = 500

    return {
      ...options,
      validationRules: [
        ...(options.validationRules || []),
        costAnalysis({
          variables: req.body.variables,
          maximumCost,
          defaultCost: 1,
          costMap,
          createError: (max: number, actual: number) => {
            const err = new ActionLimitExceededError(
              `GraphQL query exceeds maximum complexity,` +
              `please remove some nesting or fields and try again. (max: ${max}, actual: ${actual})`
            )
            return err
          },
          onComplete: (costs: number) =>
            logger.info(
              `[graphql-cost-analysis] costs: ${costs} (max: ${maximumCost})`
            )
        })
      ]
    }
  }
}

const server = new ProtectedApolloServer({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://matters.news',
      'https://www.matters.news',
      'https://oss.matters.news',
      'https://production.matters.news',
      'https://web-stage.matters.news',
      'https://oss-stage.matters.news',
      'https://web-yuus2tcp.matters.news',
      'https://web-develop.matters.news',
      'https://oss-develop.matters.news',
      'https://matters.one',
      'https://www.matters.one',
      'http://matters-server-develop.ap-southeast-1.elasticbeanstalk.com/',
      'http://matters-client-web-prod.ap-southeast-1.elasticbeanstalk.com/'
    ],
    credentials: true
  },
  schema,
  context: makeContext,
  engine: {
    apiKey: environment.apiKey
  },
  subscriptions: initSubscriptions(),
  dataSources: (): DataSources => ({
    userService: new UserService(),
    articleService: new ArticleService(),
    commentService: new CommentService(),
    draftService: new DraftService(),
    systemService: new SystemService(),
    tagService: new TagService(),
    notificationService: new NotificationService()
  }),
  uploads: {
    maxFileSize: UPLOAD_FILE_SIZE_LIMIT,
    maxFiles: 10
  },
  debug: !isProd,
  formatError: (error: any) => {
    // catch error globally
    Sentry.captureException(error)
    return error
  },
  validationRules: [depthLimit(15)]
})

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url, subscriptionsUrl }) => {
    logger.info(`🚀 Server ready at ${url}`)
    logger.info(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
  })
