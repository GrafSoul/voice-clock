import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Error Boundary Component to prevent blank screen on crashes
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('React Error Boundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#282c34',
                    color: 'white',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ marginBottom: '10px' }}>⚠️ Application Error</h2>
                    <p style={{ marginBottom: '20px', fontSize: '14px', opacity: 0.8 }}>
                        {this.state.error?.message || 'Something went wrong'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            fontSize: '14px',
                            backgroundColor: '#61dafb',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            color: '#282c34',
                            fontWeight: 'bold'
                        }}
                    >
                        Reload App
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);
