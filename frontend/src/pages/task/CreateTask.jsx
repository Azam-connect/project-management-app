import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import DynamicTable from '../../components/table/Table';
import CustomModal2 from '../../components/modal/Modal2';
import Loader from '../../components/loader/Loader';
import { SquarePen, Trash2 } from 'lucide-react';
import { Notify } from '../../components/notification/Notify';
import { useDebounce } from '../../components/customeHook/useDebounce';
import Input from '../../components/ui/Input';
import DeleteConfirmationModal from '../../components/confirmationModal/DeleteConfirmaitonModal';
import TaskForm from './TaskForm';
import {
  getAllTasks,
  clearState,
  createTask,
  updateTask,
  deleteTask,
} from '../../slices/task/taskSlice';
import moment from 'moment';

const CreateTask = () => {
  const {
    isLoading,
    isSuccess,
    isInsertSuccess,
    message,
    isError,
    tasks,
    isUpdateSuccess,
    isDeleteSuccess,
    pagination,
  } = useSelector((state) => state.task);
  const [open, setOpen] = useState(false);
  const [projcetRows, setTaskRows] = useState([]);
  const dispatch = useDispatch();
  const [file, setFile] = useState([]);
  const [formData, setFormData] = useState({
    projectId: null,
    title: '',
    description: '',
    assignedTo: null,
    deadline: null,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  useEffect(() => {
    dispatch(
      getAllTasks({
        searchParam: debouncedSearchTerm,
        currentPage: currentPage + 1,
        pageSize,
      })
    );
  }, [currentPage, pageSize, debouncedSearchTerm]);

  const handleEditClick = (row) => {
    setFormData({
      title: row?.title,
      description: row?.description,
      assignedTo: { label: row?.assignedTo?.name, value: row?.assignedTo?._id },
      projectId: { label: row?.projectId?.title, value: row?.projectId?._id },
      deadline: moment(row?.deadline).format('YYYY-MM-DD'),
    });
    setSelectedRowId(row._id);
    setIsEdit(true);
    setOpen(true);
  };

  const handleDeleteClick = (row) => {
    setIsModalOpen(true);
    setSelectedRowId(row._id);
  };

  const handleCloseModal = () => {
    setFormData({
      projectId: null,
      title: '',
      description: '',
      assignedTo: [],
      deadline: null,
    });
    setFile([]);
    setOpen(false);
    setIsEdit(false);
    setSelectedRowId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newformData = {
      projectId: formData.projectId?.value,
      title: formData?.title,
      description: formData?.description,
      assignedTo: formData.assignedTo?.value,
      deadline: formData?.deadline,
    };
    if (!newformData?.title?.length)
      return Notify('Project title is required', 'warning');
    let data = new FormData();
    data.append('projectId', newformData.projectId);
    data.append('title', newformData.title);
    data.append('description', newformData.description);
    data.append('assignedTo', newformData.assignedTo);
    data.append('status', 'todo');
    data.append('deadline', newformData.deadline);

    if (file?.length) {
      for (let i = 0; i < file.length; i++) {
        data.append('attachments', file[i]);
      }
    }

    if (isEdit && selectedRowId !== null) {
      dispatch(updateTask({ formData: data, id: selectedRowId }));
    } else dispatch(createTask(data));
  };

  const handleDelete = () => {
    dispatch(deleteTask(selectedRowId));
  };

  useEffect(() => {
    if (!isLoading && isInsertSuccess) {
      Notify('Created Successfully', 'success');
      dispatch(clearState());
      dispatch(getAllTasks({}));
      handleCloseModal();
    }
    if (!isLoading && isSuccess) {
      setTaskRows(tasks);
      dispatch(clearState());
    }
    if (!isLoading && isUpdateSuccess) {
      Notify('Updated Successfully', 'success');
      dispatch(clearState());
      dispatch(getAllTasks({}));
      handleCloseModal();
    }
    if (!isLoading && isDeleteSuccess) {
      Notify('Deleted Successfully', 'success');
      dispatch(clearState());
      dispatch(getAllTasks({}));
      handleCloseModal();
    }
    if (isError) {
      Notify(message, 'error');
      dispatch(clearState());
    }
  }, [isLoading, isInsertSuccess, isSuccess, isUpdateSuccess, isDeleteSuccess]);

  const columns = [
    {
      id: 'title',
      label: 'Project Title',
    },
    {
      id: 'description',
      label: 'Description',
      format: (row) => <p className="w-full line-clamp-2">{row}</p>,
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'center',
      format: (value, rowIndex, page, rowsPerPage, row) => (
        <div className="flex justify-center items-center w-full gap-5">
          <button
            onClick={() => handleEditClick(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <SquarePen className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading ? <Loader /> : null}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="This action cannot be undone. Do you want to continue?"
      />
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Task</h1>
          <Button
            text="Add Task"
            onClick={() => setOpen(true)}
            className="mt-4 md:mt-0"
          />
        </div>

        <div className="flex items-center justify-start min-w-32">
          <Input
            label={``}
            placeholder="Task..."
            className="w-full min-w-max"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>

        {/* Table Section */}
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

        <CustomModal2
          open={open}
          setOpen={setOpen}
          ModalContent={TaskForm}
          handleSubmit={handleSubmit}
          formData={formData}
          isEdit={isEdit}
          setFormData={setFormData}
          setFile={setFile}
        />
      </div>
    </>
  );
};

export default CreateTask;
