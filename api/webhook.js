const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })
const { createClient } = require('@supabase/supabase-js')

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature']
  try {
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
    if (event.type === 'invoice.payment_failed') {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
      const customerId = event.data.object.customer
      // TODO: map customer to user_id
      await supabase.from('users').update({ is_active: false }).eq('stripe_customer_id', customerId)
    }
    res.json({ received: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
