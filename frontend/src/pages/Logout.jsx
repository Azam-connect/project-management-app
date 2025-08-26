import React from "react";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { AuthLogout, logout } from "../slices/auth/authSlice";
import {persistor} from '../app/Store';

const Logout = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge(); // clear redux-persist storage
    navigate("/login", { replace: true }); // ⬅️ use replace to avoid back nav
  };


  return (
    <>
      <div className="bg-white p-6 w-full max-w-sm text-gray-800">
        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
        <p className="mb-6 text-sm text-gray-600">
          Are you sure you want to logout from your account?
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={onClose}
            text="Cancel"
            className="!bg-gray-300 hover:!bg-gray-400 px-4 py-2 rounded"
          />
          <Button
            type="button"
            onClick={handleLogout}
            text="Logout"
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
          />
        </div>
      </div>
    </>
  );
};

export default Logout;
