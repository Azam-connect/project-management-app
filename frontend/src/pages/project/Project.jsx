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
import ProjectForm from './ProjectForm';
import {
  createProjcet,
  getAllProject,
  updateProject,
  clearState,
  deleteProject,
} from '../../slices/project/projectSlice';
import DeleteConfirmationModal from '../../components/confirmationModal/DeleteConfirmaitonModal';

const Project = () => {
  const {
    isLoading,
    isSuccess,
    isInsertSuccess,
    message,
    isError,
    project,
    isUpdateSuccess,
    isDeleteSuccess,
    pagination,
  } = useSelector((state) => state.project);
  const [open, setOpen] = useState(false);
  const [projcetRows, setProjcetRows] = useState([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamMembers: [],
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
      getAllProject({
        searchParam: debouncedSearchTerm,
        currentPage: currentPage + 1,
        pageSize,
      })
    );
  }, [currentPage, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setProjcetRows(project);
    }
  }, [isLoading, isSuccess]);

  const handleEditClick = (row) => {
    setFormData({
      title: row?.title,
      description: row?.description,
      teamMembers: row?.teamMembers?.map((item) => {
        return { label: item.name, value: item._id };
      }),
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
      title: '',
      description: '',
      teamMembers: [],
    });
    setOpen(false);
    setIsEdit(false);
    setSelectedRowId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newformData = {
      title: formData?.title,
      description: formData?.description,
      teamMembers: formData?.teamMembers?.map((item) => item.value),
    };
    if (!newformData?.title?.length)
      return Notify('Project title is required', 'warning');

    if (isEdit && selectedRowId !== null) {
      dispatch(updateProject({ formData: newformData, id: selectedRowId }));
    } else dispatch(createProjcet(newformData));
  };

  const handleDelete = () => {
    dispatch(deleteProject(selectedRowId));
  };

  useEffect(() => {
    if (!isLoading && isInsertSuccess) {
      Notify('Created Successfully', 'success');
      dispatch(clearState());
      dispatch(getAllProject({}));
      handleCloseModal();
    }
    if (!isLoading && isSuccess) {
      setProjcetRows(project);
      dispatch(clearState());
    }
    if (!isLoading && isUpdateSuccess) {
      Notify('Updated Successfully', 'success');
      dispatch(clearState());
      dispatch(getAllProject({}));
      handleCloseModal();
    }
    if (!isLoading && isDeleteSuccess) {
      Notify('Deleted Successfully', 'success');
      dispatch(clearState());
      dispatch(getAllProject({}));
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
          <h1 className="text-2xl font-semibold text-gray-800">Project</h1>
          <Button
            text="Add Project"
            onClick={() => setOpen(true)}
            className="mt-4 md:mt-0"
          />
        </div>

        <div className="flex items-center justify-start min-w-32">
          <Input
            label={``}
            placeholder="Project..."
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
          ModalContent={ProjectForm}
          handleSubmit={handleSubmit}
          formData={formData}
          isEdit={isEdit}
          setFormData={setFormData}
        />
      </div>
    </>
  );
};

export default Project;
