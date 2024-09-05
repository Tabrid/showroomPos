import { useState } from 'react';
import logo from '../../assets/images/logo-dark.png'
import axios from 'axios';
import baseUrl from '../../Components/services/baseUrl';
const Login = () => {
  // State to handle form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State to handle errors
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(`${baseUrl}/api/auth/login-showroom-manager`, formData, { withCredentials: true });
      localStorage.setItem("userId", JSON.stringify(response.data.userId));
      window.location.href = '/'
      console.log('Form data submitted:', response.data);
      // Handle successful login (e.g., redirect to dashboard)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Error during login:', err);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <img className='w-[20%] my-4' src={logo} alt="" />
      <div className="card bg-base-100 w-full max-w-lg shrink-0 shadow-2xl mt-10">
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input id="email"
              name="email"
              placeholder="Enter email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input id="password"
              name="password"
              placeholder="Enter password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input input-bordered" />
          </div>
          {/* Display error message if there's an error */}
          {error && <div className="text-error">{error}</div>}
          <div className="form-control mt-6">
            <button className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;