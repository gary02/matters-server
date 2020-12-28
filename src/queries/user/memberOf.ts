import { CIRCLE_ACTION } from 'common/enums'
import { UserToMemberOfResolver } from 'definitions'

const resolver: UserToMemberOfResolver = async (
  { id },
  _,
  { dataSources: { atomService } }
) => {
  if (!id) {
    return []
  }

  const actions = await atomService.findMany({
    table: 'action_circle',
    select: ['target_id'],
    where: {
      action: CIRCLE_ACTION.join,
      userId: id,
    },
  })
  const circles = await atomService.circleIdLoader.loadMany(
    actions.map(({ targetId }) => targetId)
  )

  return circles
}

export default resolver
