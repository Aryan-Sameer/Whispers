import React from 'react'
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const LoginPage = () => {

  const [showPassword, setshowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const toggleEye = () => {
    setshowPassword(!showPassword);
  }

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) login(formData);
  };

  return (
    <main className='grid lg:grid-cols-2 flex-grow'>

      <section className="left flex flex-col justify-center items-center gap-4 p-6 sm:p-12 my-auto">

        <div className="header flex flex-col items-center">
          <h1 className='text-3xl font-bold my-2 text-center'>Welcome Back!</h1>
          <span>Sign in to your account</span>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6 sm:w-2/3 w-full'>

          <label className="input input-bordered flex items-center gap-2 focus-within:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="text"
              className="grow"
              value={formData.email}
              placeholder="Email"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 relative focus-within:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
            </svg>
            <input
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type={showPassword ? "text" : "password"}
              className="grow"
              value={formData.password}
              placeholder="password"
            />
            <div onClick={toggleEye} className='absolute top-[50%] translate-y-[-50%] right-0 mx-3 opacity-70'>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </label>

          <button onClick={handleSubmit} disabled={isLoggingIn} className="btn glass btn-sm w-full">
            {!isLoggingIn ?
              "Sign in" :
              <span className="loading loading-spinner"></span>
            }
          </button>

        </form>

        <div>
          <small>
            Donot have an account?
            <Link to="/signup" className='text-blue-400'> Sign up </Link>
          </small>
        </div>

      </section>

      <section>
        <AuthImagePattern title="Welcome back!"
          subtitle="Sign in to continue your conversations and catch up with your messages." />
      </section>

    </main>
  )
}

export default LoginPage
