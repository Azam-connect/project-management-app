import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader/Loader';
import { Notify } from '../../components/notification/Notify';
import SelectDropdown from '../../components/ui/SelectDropdown';
import { useDebounce } from '../../components/customeHook/useDebounce';
import {
  getAllProject,
  clearState as clearProject,
} from '../../slices/project/projectSlice';
import { getProjectReport, clearState } from '../../slices/report/reportSlice';
import { DownloadCloud } from 'lucide-react';
import { downloadPDF } from '../../utils/downloadFile';

const ProjectReport = () => {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, message, isError, projectReport } = useSelector(
    (state) => state.report
  );
  const [projcetRows, setProjcetRows] = useState([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectData, setProjectData] = useState([]);
  const projectDebounce = useDebounce(projectSearch, 500);

  const {
    project,
    isLoading: projectLoading,
    isSuccess: projectSuccess,
  } = useSelector((state) => state.project);

  const [formData, setFormData] = useState({
    projectId: null,
    userId: null,
  });

  useEffect(() => {
    if (formData?.projectId) {
      dispatch(
        getProjectReport({
          projectId: formData?.projectId?.value || '',
        })
      );
    }
  }, [formData]);

  useEffect(() => {
    dispatch(getAllProject({ search: projectSearch }));
  }, [projectDebounce]);

  useEffect(() => {
    if (!projectLoading && projectSuccess) {
      let data = project.map((item) => {
        return { label: item.title, value: item._id };
      });
      setProjectData(data);
      dispatch(clearProject());
      if (!formData?.projectId && !data.length)
        Notify('Please Create a Project', 'error');
      else if (!formData?.projectId && data.length)
        setFormData((prev) => ({ ...prev, projectId: data[0] }));
    }
  }, [projectLoading, projectSuccess]);

  const handleProjectInputChange = (e) => setProjectSearch(e);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setProjcetRows(projectReport);
      dispatch(clearState());
    }

    if (isError) {
      Notify(message, 'error');
      dispatch(clearState());
    }
  }, [isLoading, isSuccess, isError]);

  const exportClick = async () => {
    try {
      if (!formData?.projectId?.value) Notify(`Project is required`, `error`);
      let url = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/v1/report/export-task-report?projectId=${
        formData?.projectId?.value
      }`;

      downloadPDF(url, `project-report`);

      Notify('All files downloaded successfully', 'success');
    } catch (err) {
      console.log(err?.message);
      Notify('Failed to download some files. ' + err?.message, 'error');
    }
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Project Report
          </h1>
        </div>
        <div className=" w-full ">
          <details className="mb-3 border rounded-lg shadow-sm bg-gray-50">
            <summary className="cursor-pointer px-4 py-2 font-semibold hover:bg-gray-100 rounded-lg">
              Filter
            </summary>
            <div className="px-4 py-2 bg-white border-t ">
              <SelectDropdown
                label={'Project'}
                name={'projectId'}
                value={formData.projectId}
                options={projectData}
                handleInputChange={handleProjectInputChange}
                onChange={handleChange}
              />
              <button className="border rounded p-2 px-3 bg-violet-500 text-white hover:bg-violet-700 transition-all duration-150 flex flex-row">
                Export <DownloadCloud className="ml-2" onClick={exportClick} />
              </button>
            </div>
          </details>
        </div>
        <div className="bg-white rounded-lg shadow overflow-x-auto p-4">
          <p>Compleated Task: {projcetRows?.completedTasks}</p>
          <p>In-Progress Task: {projcetRows?.inProgressTasks}</p>
          <p>Todo Task: {projcetRows?.todoTasks}</p>
          <p>Total Task: {projcetRows?.totalTasks}</p>
          <p>Task Completion Rate: {projcetRows?.completionRate} %</p>
        </div>
      </div>
    </>
  );
};

export default ProjectReport;
