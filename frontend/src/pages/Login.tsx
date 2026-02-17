import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await AuthService.login(username, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            {/* Ambient Background */}
            <div className="login-ambient">
                <div className="login-orb login-orb-1" />
                <div className="login-orb login-orb-2" />
                <div className="login-orb login-orb-3" />
            </div>

            {/* Login Card */}
            <div className="login-card">

                {/* Branding */}
                <div className="login-branding">
                    <div className="login-logo">
                        <div className="login-logo-icon">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="login-title">
                        NovaCenter <span className="login-title-accent">Pro</span>
                    </h1>
                    <p className="login-subtitle">Sistema de gestión de licencias</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="login-error">
                        <svg className="login-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <span className="login-error-text">{error}</span>
                    </div>
                )}

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="username" className="login-label">Usuario</label>
                        <div className="login-input-wrapper">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="login-input"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                            <svg className="login-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                    </div>

                    <div className="login-field">
                        <label htmlFor="password" className="login-label">Contraseña</label>
                        <div className="login-input-wrapper">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="login-input"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <svg className="login-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="login-spinner" /> Iniciando sesión...</>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer">
                    <p className="login-footer-text">NovaCenter Pro · Torpush © 2026</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
