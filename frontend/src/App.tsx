import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import RequireAuth from './components/RequireAuth';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard';
import AdminUsers from './pages/AdminUsers/AdminUsers';
import AdminRoles from './pages/AdminRoles/AdminRoles';
import AdminResources from './pages/AdminResources/AdminResources';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected routes — Cualquier usuario autenticado */}
          <Route element={<RequireAuth />}>
            <Route element={<DashboardLayout />}>
              {/* Dashboard principal (licencias) */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Admin routes — Solo admin */}
              <Route element={<RequireAuth allowedRoles={['admin']} />}>
                <Route path="/dashboard/licenses" element={<Dashboard />} />
                <Route path="/dashboard/users" element={<AdminUsers />} />
                <Route path="/dashboard/roles" element={<AdminRoles />} />
                <Route path="/dashboard/resources" element={<AdminResources />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
