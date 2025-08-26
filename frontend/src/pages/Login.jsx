import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthLogin, clearState } from '../slices/auth/authSlice';
import { Notify } from '../components/notification/Notify';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { isAuthLoading, isAuthSuccess, isAuthError, authMessage } =
    useSelector((state) => state.auth);

  // 🔒 Redirect if already logged in
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('authentication');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        if (parsed.access_token) {
          navigate('/'); // redirect to home if token exists
        }
      } catch (err) {
        console.error('Failed to parse authentication token', err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(AuthLogin(formData));
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthSuccess) {
      navigate('/');
      dispatch(clearState());
    }
    if (isAuthError) {
      Notify(authMessage || 'Invalid credentials', 'error');
      dispatch(clearState());
    }
  }, [isAuthError, isAuthLoading, isAuthSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isAuthLoading}
          className={`w-full text-white py-2 px-4 rounded-md transition ${
            isAuthLoading
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isAuthLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
