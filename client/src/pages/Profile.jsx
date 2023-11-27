import {useSelector} from "react-redux"

export default function Profile() {
  const {currentUser}  = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className='text-center my-7 text-3xl font-semibold'>Profile</h1>
      <form className="flex flex-col gap-4">
          <img src={currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 " />
          <input type="text" placeholder="username" className="rounded-lg p-3 border" id="username"/>
          <input type="text" placeholder="email" className="rounded-lg p-3 border" id="email"/>
          <input type="text" placeholder="password" className="rounded-lg p-3 border" id="password"/>
          <button className="bg-slate-500 p-3 rounded-lg uppercase text-white hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer ">Delete account?</span>
        <span className="text-red-700 cursor-pointer ">Sign out</span>
      </div>
    </div>
  )
}
