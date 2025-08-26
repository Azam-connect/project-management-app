import React, { useEffect, useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SelectDropdown from '../../components/ui/SelectDropdown';
import Textarea from '../../components/ui/Textarea';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from '../../components/customeHook/useDebounce';
import {
  getAllUser,
  clearState as clearUser,
} from '../../slices/user/userSlice';
import {
  getAllProject,
  clearState as clearProject,
} from '../../slices/project/projectSlice';

const TaskForm = ({
  formData,
  setFormData,
  handleSubmit,
  isEdit,
  onClose,
  setFile,
}) => {
  const dispatch = useDispatch();
  const [userSearch, setUserSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [userData, setUserData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const userDebounce = useDebounce(userSearch, 500);
  const projectDebounce = useDebounce(projectSearch, 500);

  const { user, isLoading, isSuccess } = useSelector((state) => state.user);
  const {
    project,
    isLoading: projectLoading,
    isSuccess: projectSuccess,
  } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(getAllUser({ search: userSearch }));
  }, [userDebounce]);

  useEffect(() => {
    dispatch(getAllProject({ search: projectSearch }));
  }, [projectDebounce]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
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
  }, [isLoading, isSuccess, projectLoading, projectSuccess]);

  const handleInputChange = (e) => {
    setUserSearch(e);
  };
  const handleProjectInputChange = (e) => setProjectSearch(e);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const fileChange = (e) => setFile(e.target.files);
  const handleCancel = () => {
    onClose();
    setFormData({ title: '', description: '' });
  };

  return (
    <div className="max-w-4xl mx-auto mt-2 px-2 sm:px-2 lg:px-4">
      <div className="bg-white  p-2 sm:p-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-800">
          {isEdit ? 'Edit' : 'Create'} Task
        </h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-1 gap-1"
        >
          <Input
            label={'Title'}
            name={'title'}
            value={formData?.title}
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

          <SelectDropdown
            label={'Assigned To'}
            name={'assignedTo'}
            value={formData.assignedTo}
            options={userData}
            handleInputChange={handleInputChange}
            onChange={handleChange}
          />
          <Input
            label={'Attachments'}
            name={'attachments'}
            type="file"
            onChange={fileChange}
            multiple
          />
          <Input
            label={'Deadline'}
            name={'deadline'}
            type="date"
            value={formData?.deadline}
            onChange={handleChange}
          />
          <Textarea
            label={'Description'}
            name={'description'}
            value={formData?.description}
            onChange={handleChange}
            rows={3}
          />
          <div className="col-span-full flex justify-center gap-2 mt-4">
            <Button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 !bg-gray-400 rounded hover:!bg-gray-600"
              text={`Cancel`}
            />

            {isEdit ? (
              <Button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                text={`Update`}
              />
            ) : (
              <Button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                text={`Create`}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
