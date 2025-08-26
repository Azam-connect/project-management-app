import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader/Loader';
import { Notify } from '../../components/notification/Notify';
import { useDebounce } from '../../components/customeHook/useDebounce';
import Input from '../../components/ui/Input';

import {
  clearState,
  getAllAssignedProject,
} from '../../slices/project/projectSlice';
import ProjectCard from '../../components/card/ProjectCard';
import { useNavigate } from 'react-router-dom';

const DoneTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading,
    isSuccess,
    message,
    isError,
    assignedProject,
    pagination,
  } = useSelector((state) => state.project);
  const [projcetRows, setProjcetRows] = useState([]);

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-based index
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  useEffect(() => {
    dispatch(
      getAllAssignedProject({
        searchParam: debouncedSearchTerm,
        currentPage: currentPage + 1, // backend expects 1-based
        pageSize,
      })
    );
  }, [currentPage, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setProjcetRows(assignedProject);
      dispatch(clearState());
    }

    if (isError) {
      Notify(message, 'error');
      dispatch(clearState());
    }
  }, [isLoading, isSuccess, isError]);

  const arrowClick = (item) => {
    navigate(`/task/project/${item._id}?status=done`);
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <>
      {isLoading ? <Loader /> : null}

      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Task</h1>
          {/* <Button
            text="Add Project"
            onClick={() => setOpen(true)}
            className="mt-4 md:mt-0"
          /> */}
        </div>

        <div className="flex items-center justify-start min-w-32 mb-4">
          <Input
            label={``}
            placeholder="Task..."
            className="w-full min-w-max"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {projcetRows?.map((item, index) => (
            <ProjectCard
              key={index}
              item={item}
              title={item?.title}
              descriptions={item?.description}
              handleClick={arrowClick}
            />
          ))}
        </div>

        {/* Pagination Section */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`px-3 py-1 rounded-md border ${
              currentPage === 0
                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            Prev
          </button>

          <span className="text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage + 1 >= totalPages}
            className={`px-3 py-1 rounded-md border ${
              currentPage + 1 >= totalPages
                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default DoneTask;
