import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing Stripe key...');
console.log('Key prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...');
console.log('Key length:', process.env.STRIPE_SECRET_KEY?.length);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

try {
    const balance = await stripe.balance.retrieve();
    console.log('\n✅ Stripe Key is VALID!');
    console.log('Available balance:', balance.available);
} catch (err) {
    console.log('\n❌ Stripe Key is INVALID!');
    console.log('Error:', err.message);
    console.log('HTTP status:', err.statusCode);
}

process.exit(0);
