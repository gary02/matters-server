import { Resolver, BatchParams, Context } from 'definitions'

const resolver: Resolver = async (
  { id }: { id: string },
  { input: { offset, limit } }: BatchParams,
  { dataSources: { articleService, userService } }: Context
) => {
  const appreciators = await articleService.findAppreciatorsInBatch(
    id,
    offset,
    limit
  )
  return userService.dataloader.loadMany(
    appreciators.map(({ userId }) => userId)
  )
}

export default resolver
