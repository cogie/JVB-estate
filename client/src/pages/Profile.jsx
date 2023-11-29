import {useSelector} from "react-redux"
import { useRef, useState, useEffect} from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase"
import userSlice, { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
 } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser, loading, error}  = useSelector((state) => state.user);
  const [file, setFile]  = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData,  setFormData]  = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);
  const [deleteSuccess,  setdeleteSuccess] = useState(false);
  const dispatch = useDispatch();

  // console.log(filePerc);
  // console.log(file)
  //console.log(formData);
  

  // firebase storge
  // allow read;
  // allow write: if
  // request.resource.size < 10 * 1024 * 1024 && 
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    //track the changes of the uploaded img snapshots to create progress
    uploadTask.on(
      'state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is '+ progress + '% done' ); 
        setFilePerc(Math.round(progress));
    },
    (error) => {
      setfileUploadError(true);
    },
    //download the uploaded image
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({...formData, avatar: downloadURL})
        );
      }
    );
  };

  //function to handle the change from the profile given by the user base on the id of the input will stack on formData
  const handleChange  = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  //function to handle values from formData & send to backend
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent from refreshing the data
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json(); // get data by converting to json
      if (data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  //handles acc deletion using DELETE method with the endpoint
  const handleDeleteUser = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      setdeleteSuccess(true);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className='text-center my-7 text-3xl font-semibold'>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* clickable avatar to upload new */}
          <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept="image/*"/> 
          <img onClick={()=> fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" 
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
          <p className="self-center text-sm">
            {fileUploadError ? (
            <span className="text-red-700">Error Image upload (image should be less than 10mb)</span>
            )
            : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">
                {`Uploading ${filePerc}%`}
              </span>
            ) : filePerc === 100 ? (
              <span className="text-green-800">Image successfully uploaded! </span>
            ) : (
              ''
            )}
          </p>
          <input type="text" 
            placeholder="username" 
            className="rounded-lg p-3 border" 
            id="username" 
            defaultValue={currentUser.username}
            onChange={handleChange}
            />
          <input type="text" 
            placeholder="email" 
            className="rounded-lg p-3 border" 
            id="email" 
            defaultValue={currentUser.email}
            onChange={handleChange}
            />
          <input type="password" 
            placeholder="password"  
            className="rounded-lg p-3 border" 
            id="password"
            onChange={handleChange}
            />
          <button disabled={loading} className="bg-slate-600 p-3 rounded-lg uppercase
           text-white hover:opacity-95 disabled:opacity-80">
            {loading ? 'Loading...' : 'Update'}
          </button> 
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer ">Delete account?</span>
        <span className="text-red-700 cursor-pointer ">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>
    </div>
  )
}
