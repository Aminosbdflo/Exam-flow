import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">Paiement Annulé</h1>
                <p className="text-slate-500 mb-8 font-medium">
                    Votre transaction a été annulée. Aucun montant n'a été débité et aucun token n'a été ajouté à votre compte.
                </p>
                <div className="flex gap-4">
                    <Link
                        to="/pricing"
                        className="flex-1 py-4 text-violet-600 font-bold bg-violet-50 hover:bg-violet-100 rounded-xl transition-all"
                    >
                        Réessayer
                    </Link>
                    <Link
                        to="/"
                        className="flex-1 py-4 text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                    >
                        Accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
