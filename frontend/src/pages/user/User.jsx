import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import DynamicTable from '../../components/table/Table';
import CustomModal2 from '../../components/modal/Modal2';
import UserForm from './UserForm';
import {
  addUser,
  getAllUser,
  clearState,
  updateUser,
} from '../../slices/user/userSlice';
import Loader from '../../components/loader/Loader';
import { SquarePen } from 'lucide-react';
import { Notify } from '../../components/notification/Notify';
import { useDebounce } from '../../components/customeHook/useDebounce';
import Input from '../../components/ui/Input';
import { userRoleOptions } from '../../utils/enum/enum';

const User = () => {
  const {
    isLoading,
    isSuccess,
    isInsertSuccess,
    message,
    isError,
    user,
    isUpdateSuccess,
    pagination,
  } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userRows, setUserRows] = useState([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });

  // Edit
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Search
  const [searchValue, setSearchValue] = React.useState('');
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  useEffect(() => {
    dispatch(
      getAllUser({
        searchParam: debouncedSearchTerm,
        currentPage: currentPage + 1,
        pageSize,
      })
    );
  }, [currentPage, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setUserRows(user);
    }
  }, [isLoading, isSuccess]);

  const handleEditClick = (row) => {
    setFormData({
      name: row?.name,
      email: row?.email,
      phone_number: row?.phone_number,
      role: userRoleOptions.find((it) => it.label === row.role),
      password: '',
    });
    setSelectedRowId(row._id);
    setIsEdit(true);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setFormData({
      district: null,
      rajaswa_thana_name: '',
    });
    setOpen(false);
    setIsEdit(false);
    setSelectedRowId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newformData = {
      name: formData?.name?.trim(),
      email: formData?.email?.trim(),
      role: formData?.role?.label,
    };
    if (!newformData?.name?.length)
      return Notify('Name is required', 'warning');
    else if (!newformData?.email?.length)
      return Notify('Email is required', 'warning');
    else if (!newformData?.role?.length)
      return Notify('User role is required', 'warning');

    if (isEdit && selectedRowId !== null) {
      dispatch(updateUser({ formData: newformData, id: selectedRowId }));
    } else {
      if (!formData?.password?.length)
        return Notify('Password is required', 'warning');
      else if (formData?.password?.length <= 8)
        return Notify('Password length should be more than 8 char', 'warning');
      newformData['password'] = formData.password;
      dispatch(addUser(newformData));
    }
  };

  useEffect(() => {
    if (!isLoading && isInsertSuccess) {
      Notify('Created Successfully', 'success');
      dispatch(clearState());
      dispatch(getAllUser({}));
      handleCloseModal();
    }
    if (!isLoading && isSuccess) {
      setUserRows(user);
    }
    if (!isLoading && isUpdateSuccess) {
      Notify('Updated Successfully', 'success');
      dispatch(clearState());
      dispatch(getAllUser({}));
      handleCloseModal();
    }
    if (isError) {
      Notify(message, 'error');
      dispatch(clearState());
    }
  }, [isLoading, isInsertSuccess, isSuccess, isUpdateSuccess]);

  const columns = [
    {
      id: 'name',
      label: 'User Name',
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 170,
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'center',
      format: (value, rowIndex, page, rowsPerPage, row) => (
        <div className="flex justify-center items-center w-full">
          <button
            onClick={() => handleEditClick(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <SquarePen className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">User</h1>
          <Button
            text="Add User"
            onClick={() => setOpen(true)}
            className="mt-4 md:mt-0"
          />
        </div>

        <div className="flex items-center justify-start min-w-32">
          <Input
            label={``}
            placeholder="User..."
            className="w-full min-w-max"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow overflow-x-auto p-4">
          <DynamicTable
            rows={userRows}
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
          ModalContent={UserForm}
          handleSubmit={handleSubmit}
          formData={formData}
          isEdit={isEdit}
          setFormData={setFormData}
        />
      </div>
    </>
  );
};

export default User;
