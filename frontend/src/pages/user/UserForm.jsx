import React from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SelectDropdown from '../../components/ui/SelectDropdown';
import { userRoleOptions } from '../../utils/enum/enum';

const UserForm = ({ formData, setFormData, handleSubmit, isEdit, onClose }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    onClose();
    setFormData({ name: '', email: '', role: '', password: '' });
  };

  return (
    <div className="max-w-4xl mx-auto mt-3 px-2 sm:px-2 lg:px-2">
      <div className="bg-white  p-2 sm:p-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-800">
          {isEdit ? 'Edit User' : 'Add User'}
        </h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <Input
              label={`Name`}
              type="text"
              name={`name`}
              value={formData?.name}
              onChange={handleChange}
              className="mt-1 w-full"
              required={true}
            />
          </div>

          <div>
            <Input
              label={`Password`}
              type="password"
              name={`password`}
              value={formData?.password}
              onChange={handleChange}
              className="mt-1 w-full"
              required={true}
              disabled={isEdit}
            />
          </div>

          <div>
            <Input
              label={`Email`}
              type="email"
              name={`email`}
              value={formData?.email}
              onChange={handleChange}
              className="mt-1 w-full"
              required={true}
            />
          </div>

          <SelectDropdown
            label={`Role`}
            name={`role`}
            value={formData?.role}
            options={userRoleOptions}
            onChange={handleChange}
          />
        </form>
        <div className="flex justify-center gap-2 mt-4">
          <Button
            text={'Cancel'}
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 "
            onClick={handleCancel}
          />
          <Button
            text={'Save'}
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 "
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default UserForm;
