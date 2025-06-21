const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15'
})

module.exports = async (req, res) => {
  const { priceId, customerId } = JSON.parse(req.body || '{}')
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel'
    })
    res.json({ clientSecret: session.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
