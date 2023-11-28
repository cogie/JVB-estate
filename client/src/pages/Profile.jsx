import {useSelector} from "react-redux"
import { useRef, useState, useEffect} from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase"

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser}  = useSelector((state) => state.user);
  const [file, setFile]  = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData,  setFormData]  = useState({});
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

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className='text-center my-7 text-3xl font-semibold'>Profile</h1>
      <form className="flex flex-col gap-4">
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
          <input type="text" placeholder="username" className="rounded-lg p-3 border" id="username"/>
          <input type="text" placeholder="email" className="rounded-lg p-3 border" id="email"/>
          <input type="text" placeholder="password" className="rounded-lg p-3 border" id="password"/>
          <button className="bg-slate-600 p-3 rounded-lg uppercase text-white hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer ">Delete account?</span>
        <span className="text-red-700 cursor-pointer ">Sign out</span>
      </div>
    </div>
  )
}
