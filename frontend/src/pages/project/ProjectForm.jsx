import React, { useEffect, useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SelectDropdown from '../../components/ui/SelectDropdown';
import Textarea from '../../components/ui/Textarea';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUser, clearState } from '../../slices/user/userSlice';
import { useDebounce } from '../../components/customeHook/useDebounce';

const ProjectForm = ({
  formData,
  setFormData,
  handleSubmit,
  isEdit,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [userSearch, setUserSearch] = useState('');
  const [userData, setUserData] = useState([]);
  const userDebounce = useDebounce(userSearch, 500);

  const { user, isLoading, isSuccess } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUser({ search: userSearch }));
  }, [userDebounce]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      let data = user.map((item) => {
        return { label: item.name, value: item._id };
      });
      setUserData(data);
      dispatch(clearState());
    }
  }, [isLoading, isSuccess]);

  const handleInputChange = (e) => {
    setUserSearch(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    onClose();
    setFormData({ title: '', description: '' });
  };

  return (
    <div className="max-w-4xl mx-auto mt-2 px-2 sm:px-2 lg:px-4">
      <div className="bg-white  p-2 sm:p-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-800">
          Project
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
          <Textarea
            label={'Description'}
            name={'description'}
            value={formData?.description}
            onChange={handleChange}
            rows={3}
          />
          <SelectDropdown
            label={'Team Memeber'}
            name={'teamMembers'}
            isMulti
            value={formData.teamMembers}
            options={userData}
            handleInputChange={handleInputChange}
            onChange={handleChange}
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

export default ProjectForm;
