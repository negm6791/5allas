import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">System Anomaly Detected</h1>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                            We encountered an unexpected sequence. The antigravity protocol has been paused to prevent data instability.
                        </p>
                        <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left overflow-auto max-h-32 border border-slate-100">
                            <code className="text-[10px] text-rose-600 font-mono break-all">
                                {this.state.error?.message}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-indigo-900 hover:bg-indigo-950 text-white py-4 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-indigo-900/10 uppercase tracking-widest text-xs"
                        >
                            Reboot Matrix
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
