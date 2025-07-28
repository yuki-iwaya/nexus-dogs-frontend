import React from "react";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
};

export default Dashboard;
