import Stripe from 'stripe'

import { PAYMENT_CURRENCY } from 'common/enums'
import { environment } from 'common/environment'
import { PaymentAmountInvalidError, ServerError } from 'common/errors'
import logger from 'common/logger'
import { toProviderAmount } from 'common/utils'
import { User } from 'definitions'

/**
 * Interact with Stripe
 *
 * API Docs:
 * @see {@url https://stripe.com/docs/api}
 *
 * Error Handling:
 * @see {@url https://stripe.com/docs/error-handling}
 * @see {@url https://stripe.com/docs/error-codes}
 * @see {@url https://stripe.com/docs/api/errors/handling}
 */
class StripeService {
  stripe: Stripe

  constructor() {
    this.stripe = new Stripe(environment.stripeSecret, {
      apiVersion: '2020-03-02',
    })
  }

  handleError(err: Stripe.StripeError) {
    logger.error(err)

    switch (err.code) {
      case 'parameter_invalid_integer':
        throw new PaymentAmountInvalidError('maximum 2 decimal places')
      default:
        throw new ServerError('failed to process the payment request')
    }
  }

  createCustomer = async ({ user }: { user: User }) => {
    try {
      return await this.stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })
    } catch (err) {
      this.handleError(err)
    }
  }

  createPaymentIntent = async ({
    customerId,
    amount,
    currency,
  }: {
    customerId: string
    amount: number
    currency: PAYMENT_CURRENCY
  }) => {
    try {
      return await this.stripe.paymentIntents.create({
        customer: customerId,
        amount: toProviderAmount({ amount }),
        currency,
      })
    } catch (err) {
      this.handleError(err)
    }
  }
}

export const stripe = new StripeService()