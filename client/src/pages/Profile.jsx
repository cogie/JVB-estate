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
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
 } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import Contact from "../components/Contact"; //hmmm i think change?

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser, loading, error}  = useSelector((state) => state.user);
  const [file, setFile]  = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData,  setFormData]  = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);
  const [deleteSuccess,  setdeleteSuccess] = useState(false); //hmmmm
  const dispatch = useDispatch();
  const [showListingsError,  setshowListingsError] = useState(false);
  const [userListing, setUserListings] = useState([]);
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

  //handles signout
  const handleTimeOut = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  //show user listings
  const handleShowListing = async () => {
    try {
      setshowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setshowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setshowListingsError(true);
    }
  };

  //delete user lisitings
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json(); //convert to json
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      //if success get prev data then filter out
      setUserListings((prev) => 
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message)
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className='text-center my-7 text-3xl font-semibold'>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* clickable avatar to upload new */}
          <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept="image/*"/> 
          <img onClick={()=> fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" 
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border" />
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
            //sample sample
            />
            {/* 
              must add contact number from the landlord for ease of contact
            */}
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
          <Link to={'/create-listing'} className="bg-green-700 p-3 rounded-lg text-white uppercase text-center hover:opacity-95">
            Create Listing
          </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer ">Delete account?</span>
        <span onClick={handleTimeOut} className="text-red-700 cursor-pointer ">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>
      <button onClick={handleShowListing} className="text-green-600 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingsError ? 'Error Showing Listings' : ''}</p>

      {/* if listing exist show listing */}
      {userListing && userListing.length > 0 &&
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-5 text-2xl font-semibold">Your Listings</h1>
        {userListing.map((listing) => (
          <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center mt-3 gap-4">
            <Link to={`/listing/${listing._id}`}>
              {listing.title}
              <img src={listing.imageUrls[0]} alt="listing cover"
              className="h-16 w-16 object-contain" />
            </Link>
            <Link className="flex-1 text-slate-700 font-semibold hover:underline truncate" to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>
            {/* <Contact fileRef={fileRef} /> */}

            <div className="flex flex-col items-center">
              <button 
              onClick={()=> handleListingDelete(listing._id)}
              className="text-red-700 uppercase hover:shadow-lg">
                Delete
              </button>
              {/* need to get the listingId for update-listing */}
              <Link to={`/update-listing/${listing._id}`}> 
                <button 
                className="text-green-700 uppercase hover:shadow-lg">
                  Edit
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>}
    </div>
  )
}
