import React, { useEffect, useState } from 'react';
import TaskModal from '../../components/modal/TaskModal';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearState,
  getAllTasks,
  updateTask,
} from '../../slices/task/taskSlice';
import { downloadPDF } from '../../utils/downloadFile';
import { Notify } from '../../components/notification/Notify';

const TaskList = () => {
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');

  const { tasks, isLoading, isSuccess, isUpdateSuccess, isError, message } =
    useSelector((state) => state.task);

  const [taskData, setTaskData] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(getAllTasks({ status, id: params?.project }));
  }, []);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setTaskData(tasks);
      dispatch(clearState());
    }
    if (!isLoading && isUpdateSuccess) {
      Notify('Task updated', 'success');
      dispatch(clearState());
      dispatch(getAllTasks({ status, id: params?.project }));
    }
    if (isError) {
      Notify(message, 'error');
      dispatch(clearState());
    }
  }, [isLoading, isSuccess, isUpdateSuccess, isError]);

  // Handle Done
  const handleDone = (id) => {
    let updateStatus = '';
    if (status === 'todo') updateStatus = 'in-progress';
    else if (status === 'in-progress') updateStatus = 'done';
    dispatch(updateTask({ formData: { status: updateStatus }, id: id }));
    setSelectedTask(null);
  };

  const downloadAttachment = async (data) => {
    console.log(`attachment download`, data);
    let attachment = data.attachments;

    try {
      if (!attachment?.length) {
        return Notify('No files to download', 'warning');
      }

      // build full URLs
      let urls = attachment.map(
        (file) => `${import.meta.env.VITE_API_BASE_URL}${file}`
      );

      // run all downloads in parallel
      await Promise.all(
        urls.map((url, index) =>
          downloadPDF(url, `attachment-url-${index + 1}.pdf`)
        )
      );

      Notify('All files downloaded successfully', 'success');
    } catch (err) {
      console.log(err?.message);
      Notify('Failed to download some files. ' + err?.message, 'error');
    }
  };

  return (
    <>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Task Cards */}
        {taskData?.map((task, ind) => (
          <div
            key={ind}
            onClick={() => setSelectedTask(task)}
            className="bg-white shadow-md rounded-2xl p-4 cursor-pointer hover:shadow-lg transition border hover:border-blue-400"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {task.description}
            </p>
          </div>
        ))}

        {/* Task Modal */}
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDone={handleDone}
          downloadAttachment={downloadAttachment}
          status={status}
        />
      </div>
    </>
  );
};

export default TaskList;
