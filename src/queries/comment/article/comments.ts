import { connectionFromPromisedArray } from 'common/utils'

import { ArticleToCommentsResolver } from 'definitions'
import { fromGlobalId } from 'common/utils'

const resolver: ArticleToCommentsResolver = (
  { id },
  { input: { author, sort, parent, ...connectionArgs } },
  { dataSources: { commentService } }
) => {
  if (author) {
    const { id: authorId } = fromGlobalId(author)
    author = authorId
  }

  return connectionFromPromisedArray(
    commentService.findByArticle({ id, author, sort, parent }),
    connectionArgs
  )
}

export default resolver
