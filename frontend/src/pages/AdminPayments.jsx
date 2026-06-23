import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Download } from 'lucide-react';
import api from '../store/useAuthStore';
import dayjs from 'dayjs';

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPayments();
    }, [page, search]);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/payments/admin?page=${page}&limit=10&search=${search}`);
            setPayments(res.data.payments);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch payments', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchPayments();
    };

    const exportCSV = () => {
        if (!payments.length) return;

        // Convert to CSV
        const headers = ['Utilisateur', 'Email', 'Montant', 'Tokens', 'Date', 'Statut', 'Session ID'];
        const rows = payments.map(p => [
            p.userId?.name || 'Inconnu',
            p.userId?.email || 'Inconnu',
            p.amount,
            p.tokensPurchased,
            dayjs(p.createdAt).format('DD/MM/YYYY HH:mm'),
            p.status,
            p.stripeSessionId
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `paiements_${dayjs().format('YYYY-MM-DD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Paiements</h1>
                    <p className="text-slate-500 font-medium">Gérez l'historique des transactions Stripe.</p>
                </div>
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                    <Download className="w-5 h-5" />
                    Export CSV
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par email d'utilisateur..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-medium"
                            />
                        </div>
                        <button type="submit" className="bg-violet-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors">
                            Rechercher
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-12 flex justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                    <th className="p-4 px-6 border-b border-slate-100">Utilisateur</th>
                                    <th className="p-4 px-6 border-b border-slate-100">Montant</th>
                                    <th className="p-4 px-6 border-b border-slate-100">Tokens</th>
                                    <th className="p-4 px-6 border-b border-slate-100">Date</th>
                                    <th className="p-4 px-6 border-b border-slate-100">Statut</th>
                                    <th className="p-4 px-6 border-b border-slate-100">Stripe ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(payment => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={payment._id}
                                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="p-4 px-6">
                                            <div className="font-bold text-slate-900">{payment.userId?.name || 'Utilisateur supprimé'}</div>
                                            <div className="text-sm text-slate-500">{payment.userId?.email || 'N/A'}</div>
                                        </td>
                                        <td className="p-4 px-6 font-bold text-slate-900">{payment.amount}€</td>
                                        <td className="p-4 px-6">
                                            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-violet-100 text-violet-700 font-semibold text-xs">
                                                +{payment.tokensPurchased}
                                            </span>
                                        </td>
                                        <td className="p-4 px-6 text-sm text-slate-500 font-medium">
                                            {dayjs(payment.createdAt).format('DD MMM YYYY, HH:mm')}
                                        </td>
                                        <td className="p-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full font-bold text-xs ${payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    payment.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="p-4 px-6 text-xs text-slate-400 max-w-[200px] truncate" title={payment.stripeSessionId}>
                                            {payment.stripeSessionId}
                                        </td>
                                    </motion.tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">Aucun paiement trouvé</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="px-4 py-2 font-black text-slate-900">
                            {page} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
