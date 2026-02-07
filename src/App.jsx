import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import FAQBot from './components/FAQBot';
import LoadingSpinner from './components/LoadingSpinner';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TestPage = lazy(() => import('./pages/TestPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const QuestionBank = lazy(() => import('./pages/admin/QuestionBank'));
const CodingChallenges = lazy(() => import('./pages/admin/CodingChallenges'));
const TestManager = lazy(() => import('./pages/admin/TestManager'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const PlaceholderPage = lazy(() => import('./pages/admin/PlaceholderPage'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Profile = lazy(() => import('./pages/Profile'));
const PracticePage = lazy(() => import('./pages/PracticePage'));

import ScrollToTop from './components/ScrollToTop';

function Layout() {
    const location = useLocation();
    const showFAQBot = location.pathname !== '/admin/login';

    return (
        <div className="min-h-screen flex flex-col bg-brand-dark text-white font-sans">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow">
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/leaderboard" element={
                            <ProtectedRoute>
                                <Leaderboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="/practice" element={
                            <ProtectedRoute>
                                <PracticePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/test/:testId" element={
                            <ProtectedRoute>
                                <TestPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/result" element={
                            <ProtectedRoute>
                                <ResultPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin" element={
                            <ProtectedRoute adminOnly>
                                <AdminLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="questions" element={<QuestionBank />} />
                            <Route path="coding" element={<CodingChallenges />} />
                            <Route path="tests" element={<TestManager />} />
                            <Route path="settings" element={<AdminSettings />} />
                        </Route>
                        <Route path="/admin/login" element={<AdminLogin />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
            {showFAQBot && <FAQBot />}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
}

export default App;
