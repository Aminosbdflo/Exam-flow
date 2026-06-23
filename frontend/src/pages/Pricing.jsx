import { motion } from 'framer-motion';
import { Check, X, Shield, Zap, Sparkles } from 'lucide-react';
import api from '../store/useAuthStore';

const PACKAGES = [
    {
        id: 'starter',
        name: 'Pack Starter',
        tokens: 50,
        price: 5.0,
        icon: Shield,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        features: ['50 crédits d\'examen', 'Accès basique', 'Support standard']
    },
    {
        id: 'pro',
        name: 'Pack Pro',
        tokens: 150,
        price: 12.0,
        icon: Zap,
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/50',
        popular: true,
        features: ['150 crédits d\'examen', 'Résultats détaillés', 'Support prioritaire', 'Statistiques avancées']
    },
    {
        id: 'premium',
        name: 'Pack Premium',
        tokens: 500,
        price: 30.0,
        icon: Sparkles,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        features: ['500 crédits d\'examen', 'Historique illimité', 'Coach IA', 'Certificat PDF']
    }
];

export default function Pricing() {
    const handleCheckout = async (packageType) => {
        try {
            const res = await api.post('/payments/create-checkout-session', { packageType });
            window.location.href = res.data.url;
        } catch (error) {
            console.error("Checkout error:", error);
            const msg = error?.response?.data?.message || error?.message || 'Erreur inconnue';
            alert("Erreur Stripe: " + msg);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Rechargez vos crédits d'examen
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        1 token = 1 examen. Achetez des packs pour continuer à passer vos certifications.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {PACKAGES.map((pkg, idx) => {
                        const Icon = pkg.icon;
                        return (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative bg-white rounded-3xl border ${pkg.border} p-8 flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                                        <span className="bg-violet-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                                            Plus populaire
                                        </span>
                                    </div>
                                )}

                                <div className={`w-14 h-14 ${pkg.bg} ${pkg.color} rounded-2xl flex items-center justify-center mb-6`}>
                                    <Icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-4xl font-black text-slate-900">{pkg.price}€</span>
                                    <span className="text-slate-500 font-medium">/ einmalig</span>
                                </div>

                                <div className="mb-8 flex items-center gap-2">
                                    <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-semibold text-slate-700">
                                        {pkg.tokens} Tokens
                                    </div>
                                </div>

                                <ul className="flex-1 space-y-4 mb-8">
                                    {pkg.features.map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 stroke-[3]" />
                                            </div>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleCheckout(pkg.id)}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${pkg.popular
                                        ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200'
                                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                        }`}
                                >
                                    Acheter {pkg.tokens} tokens
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
