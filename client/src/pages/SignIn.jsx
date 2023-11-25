import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
      //need a variable to handle changes
      const [formData, setFormData] = useState({});
      // const [error, setError] = useState(null); //handles error
      // const [loading, setLoading] = useState(false); // loading of the sign button
      const {loading, error} = useSelector((state) => state.user);
      const navigate = useNavigate();
      const dispatch = useDispatch();
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.id]:e.target.value,
        });
      };

      //need a variable to handle the data from submit
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          //setLoading(true);
          dispatch(signInStart());
          //need to fetch datas
          const res  = await fetch('/api/auth/signin',{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // convert data to string
          });
          const data = await res.json();
          console.log(data);
          if(data.success === false) {
            // setLoading(false);
            // setError(data.message);
            dispatch(signInFailure(data.message));    
            return;
          }
          dispatch(signInSuccess(data));
          navigate('/');
        } catch (error) {
          // setLoading(false);
          // setError(error.message);
          dispatch(signInFailure(error.message));
        }
        // console.log(formData);
      };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type="email" 
        placeholder='email' 
        className='border p-3 rounded-lg' 
        id='email' 
        onChange={handleChange}
        />
        <input type="password" 
        placeholder='password' 
        className='border p-3 rounded-lg' 
        id='password'
        onChange={handleChange}
        />
        {/* button add disable later on*/}
        <button disabled={loading} className='bg-slate-700 p-3 rounded-lg uppercase text-white hover:opacity-95 disabled:opacity-80 '>
          {loading ? 'loading..': 'Sign-In'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p className=''>Dont have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700 '>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}