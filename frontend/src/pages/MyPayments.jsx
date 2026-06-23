import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Zap, CreditCard, Clock } from 'lucide-react';
import api from '../store/useAuthStore';
import dayjs from 'dayjs';

export default function MyPayments() {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/payments/my-payments')
            .then(res => setPayments(res.data))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Mes Achats</h1>
                    <p className="text-slate-500 font-medium">Historique de vos transactions de tokens.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    </div>
                ) : payments.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-md">
                        <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-8 h-8 text-violet-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun achat pour l'instant</h3>
                        <p className="text-slate-400 mb-6">Vos transactions de tokens apparaîtront ici.</p>
                        <a href="/pricing" className="inline-block bg-violet-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-violet-700 transition-colors">
                            Voir les packs
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {payments.map((payment, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={payment._id}
                                className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-violet-500" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-lg">+{payment.tokensPurchased} Tokens</div>
                                        <div className="flex items-center gap-2 text-sm text-slate-400 mt-0.5">
                                            <Clock className="w-3 h-3" />
                                            {dayjs(payment.createdAt).format('DD MMM YYYY à HH:mm')}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-slate-900">{payment.amount}€</div>
                                    <span className={`inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-xs font-bold ${payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {payment.status === 'completed' ? '✓ Complété' : payment.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
