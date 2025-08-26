import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DynamicTable from '../../components/table/Table';
import Loader from '../../components/loader/Loader';
import { Notify } from '../../components/notification/Notify';
import {
  getActivityLog,
  clearState,
} from '../../slices/activity-log/activityLogSlice.js';
import moment from 'moment';
import SelectDropdown from '../../components/ui/SelectDropdown';
import { useDebounce } from '../../components/customeHook/useDebounce';
import {
  getAllUser,
  clearState as clearUser,
} from '../../slices/user/userSlice';
import {
  getAllProject,
  clearState as clearProject,
} from '../../slices/project/projectSlice';

const ActivityLog = () => {
  const dispatch = useDispatch();
  const { userType, userInfo } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, message, isError, activity, pagination } =
    useSelector((state) => state.activity);
  const [projcetRows, setProjcetRows] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [userData, setUserData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const userDebounce = useDebounce(userSearch, 500);
  const projectDebounce = useDebounce(projectSearch, 500);

  const {
    user,
    isLoading: userLoading,
    isSuccess: userSuccess,
  } = useSelector((state) => state.user);
  const {
    project,
    isLoading: projectLoading,
    isSuccess: projectSuccess,
  } = useSelector((state) => state.project);

  const [formData, setFormData] = useState({
    projectId: null,
    userId: null,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    dispatch(
      getActivityLog({
        currentPage: currentPage + 1,
        pageSize,
        userId:
          userType === 'admin'
            ? formData?.userId?.value || ''
            : userInfo?.userId,
        projectId: formData?.projectId?.value || '',
      })
    );
  }, [currentPage, pageSize, formData]);

  useEffect(() => {
    dispatch(getAllUser({ search: userSearch }));
  }, [userDebounce]);

  useEffect(() => {
    dispatch(getAllProject({ search: projectSearch }));
  }, [projectDebounce]);

  useEffect(() => {
    if (!userLoading && userSuccess) {
      let data = user.map((item) => {
        return { label: item.name, value: item._id };
      });
      setUserData(data);
      dispatch(clearUser());
    }
    if (!projectLoading && projectSuccess) {
      let data = project.map((item) => {
        return { label: item.title, value: item._id };
      });
      setProjectData(data);
      dispatch(clearProject());
    }
  }, [userLoading, userSuccess, projectLoading, projectSuccess]);

  const handleInputChange = (e) => {
    setUserSearch(e);
  };
  const handleProjectInputChange = (e) => setProjectSearch(e);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setProjcetRows(activity);
      dispatch(clearState());
    }

    if (isError) {
      Notify(message, 'error');
      dispatch(clearState());
    }
  }, [isLoading, isSuccess, isError]);

  const columns = [
    {
      id: 'projectTitle',
      label: 'Project Title',
    },
    {
      id: 'taskId',
      label: 'Task',
      format: (row) => <p className="w-full ">{row?.title}</p>,
    },
    {
      id: 'projectTitle',
      label: 'Project Title',
    },
    {
      id: 'detail',
      label: 'activity',
      format: (row) => <p className="w-full ">{row}</p>,
    },
    {
      id: 'createdAt',
      label: 'Time',
      format: (row) => (
        <p className="w-full line-clamp-2">
          {moment(row).format('hh:mm:ss a DD/MM/YYYY')}
        </p>
      ),
    },
  ];

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Activity Log</h1>
        </div>
        <div className=" w-full ">
          <details className="mb-3 border rounded-lg shadow-sm bg-gray-50">
            <summary className="cursor-pointer px-4 py-2 font-semibold hover:bg-gray-100 rounded-lg">
              Filter
            </summary>
            <div className="px-4 py-2 bg-white border-t grid grid-cols-2 gap-2">
              <SelectDropdown
                label={'User'}
                name={'userId'}
                value={formData.userId}
                options={userData}
                className={`${userType === 'admin' ? '' : 'hidden'}`}
                handleInputChange={handleInputChange}
                onChange={handleChange}
              />
              <SelectDropdown
                label={'Project'}
                name={'projectId'}
                value={formData.projectId}
                options={projectData}
                handleInputChange={handleProjectInputChange}
                onChange={handleChange}
              />
            </div>
          </details>
        </div>
        <div className="bg-white rounded-lg shadow overflow-x-auto p-4">
          <DynamicTable
            rows={projcetRows}
            columns={columns}
            page={currentPage}
            setPage={setCurrentPage}
            rowsPerPage={pageSize}
            setRowsPerPage={setPageSize}
            pagination={pagination}
          />
        </div>
      </div>
    </>
  );
};

export default ActivityLog;
