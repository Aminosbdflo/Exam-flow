import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Zap, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import api from '../store/useAuthStore';

export default function SuccessPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { refreshTokens } = useAuthStore();
    const navigate = useNavigate();

    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [newTokens, setNewTokens] = useState(null);
    const [tokensPurchased, setTokensPurchased] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!sessionId) {
            navigate('/pricing');
            return;
        }

        const verify = async () => {
            try {
                // Call the backend to verify the Stripe session & credit tokens
                const res = await api.get(`/payments/verify-session/${sessionId}`);

                if (res.data.success) {
                    setNewTokens(res.data.tokens);
                    setTokensPurchased(res.data.tokensPurchased);
                    // Update the navbar token counter
                    await refreshTokens();
                    setStatus('success');
                }
            } catch (err) {
                const msg = err?.response?.data?.message || 'Erreur de vérification du paiement.';
                setErrorMsg(msg);
                setStatus('error');
            }
        };

        verify();
    }, [sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-emerald-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md w-full text-center"
            >
                {status === 'loading' && (
                    <>
                        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-3">Vérification en cours...</h1>
                        <p className="text-slate-500 font-medium">Nous validons votre paiement et créditons vos tokens.</p>
                        <div className="mt-8 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-violet-500 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: '90%' }}
                                transition={{ duration: 3, ease: 'easeInOut' }}
                            />
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                            className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle2 className="w-10 h-10" />
                        </motion.div>

                        <h1 className="text-3xl font-black text-slate-900 mb-2">Paiement Réussi !</h1>

                        {tokensPurchased && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="my-6 py-5 px-6 bg-violet-50 rounded-2xl border border-violet-100 flex items-center justify-center gap-3"
                            >
                                <span className="text-2xl font-black text-violet-400">+</span>
                                <Zap className="w-6 h-6 text-violet-500" fill="currentColor" />
                                <span className="text-3xl font-black text-violet-700">{tokensPurchased}</span>
                                <span className="text-slate-400 font-bold text-sm">tokens ajoutés</span>
                            </motion.div>
                        )}

                        {newTokens !== null && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-sm text-slate-500 mb-6 font-medium"
                            >
                                Solde total : <span className="font-black text-slate-900">{newTokens} tokens</span>
                            </motion.p>
                        )}

                        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                            Vos tokens ont été ajoutés à votre compte. Vous pouvez maintenant passer vos examens.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link
                                to="/exams"
                                className="block w-full py-4 text-white font-bold bg-violet-600 hover:bg-violet-700 rounded-xl transition-all shadow-lg shadow-violet-100 text-lg"
                            >
                                Voir les examens →
                            </Link>
                            <Link
                                to="/my-payments"
                                className="block w-full py-3 text-slate-400 font-semibold hover:text-slate-600 rounded-xl transition-colors text-sm"
                            >
                                Historique des achats
                            </Link>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-3">Vérification échouée</h1>
                        <p className="text-slate-500 mb-8 font-medium">{errorMsg}</p>
                        <div className="flex flex-col gap-3">
                            <Link to="/pricing" className="block w-full py-4 text-white font-bold bg-violet-600 hover:bg-violet-700 rounded-xl transition-all">
                                Réessayer
                            </Link>
                            <Link to="/exams" className="block w-full py-3 text-slate-400 font-semibold hover:text-slate-600 text-sm">
                                Retour aux examens
                            </Link>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
