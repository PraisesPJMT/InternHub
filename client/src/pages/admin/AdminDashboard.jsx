import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const { logout } = useAuth();
  return (
    <>
      <div>
        <h1>Admin Dashboard</h1>
        
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
