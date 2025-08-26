import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboard, clearState } from '../slices/report/reportSlice';
import { Notify } from '../components/notification/Notify';
import DashboardCard from '../components/card/DashboardCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { isDashboardSuccess, isLoading, userDashboard, isError, message } =
    useSelector((state) => state.report);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (userInfo?.userId)
      dispatch(getDashboard({ formData: { userIds: [userInfo.userId] } }));
  }, []);

  useEffect(() => {
    if (isDashboardSuccess && !isLoading) {
      setUserData(userDashboard);
      dispatch(clearState());
    }
    if (isError) {
      Notify(message, 'error');
      dispatch(clearState());
    }
  }, [isLoading, isDashboardSuccess, isError]);

  return (
    <>
      <div className="pt-6">
        <h1 className="text-2xl font-bold ">Dashboard</h1>
      </div>
      <hr className="my-7" />
      <div className="mb-4 text-xl font-bold ">
        <h2>Hi, {userData?.userName}</h2>
        <h2>Welcome</h2>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <DashboardCard
          title={`Activity Count`}
          count={userData?.activityCount}
        />
        <DashboardCard
          title={`Compleated Task`}
          count={userData?.completedTasks}
        />
        <DashboardCard title={`Total Task`} count={userData?.totalTasks} />
      </div>
    </>
  );
};

export default Dashboard;
