
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from "./components/layout/Navigation";
import Index from '@/pages/Index';
import CommitteePage from '@/pages/CommitteePage';
import CommitteeDetail from '@/components/committee/CommitteeDetail';
import SpecificationManagement from '@/components/specification/SpecificationManagement';
import NotFound from '@/pages/NotFound';
import TendersPage from '@/pages/TendersPage';
import ProcurementPlanPage from '@/pages/ProcurementPlanPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from './components/auth/RegistrationForm';
import EmployeeEdit from './components/employee/EmployeeEdit';
import CommitteeUpdate from './components/committee/edit/CommitteEdit';
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/committee" element={<CommitteePage />} />
              <Route path="/committee/create" element={<CommitteePage />} />
              <Route path="/committees/:id" element={<CommitteeDetail />} />
              <Route path="/specification/:id" element={<SpecificationManagement />} />
              <Route path="/tenders" element={<TendersPage />} />
              <Route path="/procurement-plan" element={<ProcurementPlanPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/employees/edit/:userId" element={<EmployeeEdit />} />
              <Route path="/committees/edit/:committeeId" element={<CommitteeUpdate />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
          
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
