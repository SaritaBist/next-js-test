import DashboardComponent from '@/components/dashboard';
import ProtectedRoute from '@/components/protected-route';

const Dashboard = () => {
    return (
        <ProtectedRoute>
            <DashboardComponent />
        </ProtectedRoute>
    );
};

export default Dashboard;