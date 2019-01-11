require('module-alias/register')

import { printSchema } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import fs from 'fs'

import logger from 'common/logger'
import typeDefs from 'types'

const schemaObj = makeExecutableSchema({
  typeDefs,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
})

const schemaString = printSchema(schemaObj)

fs.writeFile('schema.graphql', schemaString, function(err) {
  if (err) {
    logger.error(err)
  } else {
    logger.info('Successfully printed schema.')
  }
})
