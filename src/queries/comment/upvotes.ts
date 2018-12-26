import { Resolver } from 'definitions'

const resolver: Resolver = (
  { id, upvotes },
  _,
  { dataSources: { commentService } }
) => parseInt(upvotes, 10) || commentService.countUpVote(id)

export default resolver
