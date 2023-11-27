import {useSelector} from "react-redux"
import { useRef, useState, useEffect} from "react";
import {getStorage, ref, uploadBytesResumable} from "firebase/storage"
import {app} from "../firebase"

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser}  = useSelector((state) => state.user);
  const [file, setFile]  = useState(undefined);
  console.log(file)

  // firebase storge
  //   allow read;
  //   allow write: if  
  //   request.resource.size < 2 * 1024 * 1024 && 
  //   request.resource.contentType.matches('image/.*')

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

    uploadTask.on(
      'state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is '+ progress + '% done' ); 
      },
    );
  };

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className='text-center my-7 text-3xl font-semibold'>Profile</h1>
      <form className="flex flex-col gap-4">
      {/* clickable avatar to upload new */}
          <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept="image/*"/> 
          <img onClick={()=> fileRef.current.click()} src={currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 " />
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
