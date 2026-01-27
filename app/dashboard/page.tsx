import DashboardComponent from '@/components/dashboard/dashboard';
import ProtectedRoute from '@/components/common/protected-route';

const Dashboard = () => {
    return (
        <ProtectedRoute>
            <DashboardComponent />
        </ProtectedRoute>
    );
};

export default Dashboard;