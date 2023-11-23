import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  //Keep all the changes from the form and keep all data
  const [formData, setFormData] = useState({}); 
  const [error, setError] = useState(null); //handle the error
  const [loading, setLoading] = useState(false); // set the loading after sign up

  const handleChange = (e)=>{
    setFormData({
      //keep all information so data wont lose
      ...formData,
      [e.target.id]: e.target.value, 
    });
  };

  //handle the submitted data form the form/fetch
  const handleSubmit  = async (e)=>{
  e.preventDefault();
  try {
    setLoading(true);
    const res = await fetch('/api/auth/signup',
    { //change form data into string using stringyfy
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
       },
      body: JSON.stringify(formData),
    });
    //convert response to json
    const data  = await res.json();
    console.log(data)
    if(data.success === false){ //send an error
      setLoading(false);
      setError(data.message);
      return;
    }   
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setError(error.message);
  }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        
        <input type="username" 
        placeholder='username' 
        className='border p-3 rounded-lg' 
        id='username'
        onChange={handleChange} 
        />
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
          {loading ?  'loading..': 'Sign Up'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p className=''>Already have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-700 '>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>} 
    </div>
  );
}
