// frontend/src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from './pages/Dashboard';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-[#f8fafc]">
                <Dashboard />
            </div>
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
}

export default App;
