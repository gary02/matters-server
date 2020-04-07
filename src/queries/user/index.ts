import { toGlobalId } from 'common/utils'
import {
  GQLAppreciationTypeResolver,
  GQLLikerTypeResolver,
  GQLLIKETypeResolver,
  GQLQueryTypeResolver,
  GQLRecommendationTypeResolver,
  GQLUserActivityTypeResolver,
  GQLUserInfoTypeResolver,
  GQLUserOSSTypeResolver,
  GQLUserSettingsTypeResolver,
  GQLUserStatusTypeResolver,
  GQLUserTypeResolver,
  GQLWalletTypeResolver,
} from 'definitions'

import { Appreciation } from './appreciation'
import articleCount from './articleCount'
import avatar from './avatar'
import badges from './badges'
import blockList from './blockList'
import commentCount from './commentCount'
import followees from './followees'
import followers from './followers'
import isBlocked from './isBlocked'
import isBlocking from './isBlocking'
import isFollowee from './isFollowee'
import isFollower from './isFollower'
import Liker from './liker'
import likerId from './liker/likerId'
import rateUSD from './liker/rateUSD'
import total from './liker/total'
import notification from './notification'
import oauthProviders from './oauthProviders'
import { boost, score } from './oss'
import profileCover from './profileCover'
import Recommendation from './recommendation'
import rootUser from './rootUser'
import subscriptions from './subscriptions'
import totalWordCount from './totalWordCount'
import unreadFolloweeArticles from './unreadFolloweeArticles'
import unreadNoticeCount from './unreadNoticeCount'
import unreadResponseInfoPopUp from './unreadResponseInfoPopUp'
import UserActivity from './userActivity'
import userNameEditable from './userNameEditable'
import Wallet from './wallet'

const user: {
  Query: GQLQueryTypeResolver
  User: GQLUserTypeResolver
  Recommendation: GQLRecommendationTypeResolver
  UserInfo: GQLUserInfoTypeResolver
  UserSettings: GQLUserSettingsTypeResolver
  UserActivity: GQLUserActivityTypeResolver
  Liker: GQLLikerTypeResolver
  Wallet: GQLWalletTypeResolver
  LIKE: GQLLIKETypeResolver
  Appreciation: GQLAppreciationTypeResolver
  UserStatus: GQLUserStatusTypeResolver
  UserOSS: GQLUserOSSTypeResolver
} = {
  Query: {
    viewer: (root, _, { viewer }) => viewer,
    user: rootUser,
  },
  User: {
    id: ({ id }) => (id ? toGlobalId({ type: 'User', id }) : ''),
    avatar,
    likerId,
    liker: (root) => root,
    info: (root) => root,
    wallet: (root) => root,
    settings: (root) => root,
    status: (root) => (root.id ? root : null),
    activity: (root) => root,
    recommendation: (root) => root,
    oss: (root) => root,
    // hasFollowed,
    subscriptions,
    followers,
    followees,
    isFollower,
    isFollowee,
    blockList,
    isBlocking,
    isBlocked,
  },
  Recommendation,
  Liker,
  UserInfo: {
    badges,
    userNameEditable,
    email: ({ email }) => email && email.replace(/#/g, '@'),
    profileCover,
  },
  Wallet,
  UserSettings: {
    language: ({ language }, _, { viewer }) => language,
    notification,
    oauthProviders,
  },
  UserActivity,
  LIKE: {
    total,
    rateUSD,
  },
  Appreciation,
  UserStatus: {
    LIKE: (root) => root,
    articleCount,
    commentCount,
    unreadNoticeCount,
    unreadFolloweeArticles,
    unreadResponseInfoPopUp,
    totalWordCount,
  },
  UserOSS: {
    boost,
    score,
  },
}

export default user
