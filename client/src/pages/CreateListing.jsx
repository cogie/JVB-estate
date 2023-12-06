import { useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable, uploadString } from 'firebase/storage';
import { app } from '../firebase'

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [imageUploadError, setimageUploadError] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [uploading, setUploading] = useState(false);
    console.log(formData);

    //image
    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            setimageUploadError(false);

            const promises = []; //return multiple images

            //function for each images upload/storing
            for (let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls), 
                });
                setimageUploadError(false);
                setUploading(false); 
            })
            .catch((error) => {
                setimageUploadError('Image upload failed (10 mb max per image)');
                setUploading(false);
            });
        }else{
            setimageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };

    //handles urls that will be stored in promises
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file); 
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error)=> {
                    reject(error);
                },
                ()=> {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );   
        });
    };
    //remove the images
    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i)  => i !== index ),

        });
    };
  return (
    <main className="p-3 max-w-4xl mx-auto">
    <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
    <form className="flex flex-col sm:flex-row gap-4">
        {/* 1st div */}
        <div className="flex flex-col gap-4 flex-1">
            <input type="text" placeholder="Name" className="border p-3 rounded-lg" id="name" maxLength="62" minLength="10" required/>
            <textarea type="text" placeholder="Description" className="border p-3 rounded-lg" id="description" required/>
            <input type="text" placeholder="Address" className="border p-3 rounded-lg" id="Address" required/>
            <div className="flex gap-6 flex-wrap">
                <div className="flex gap-2">
                    <input type="checkbox" id="sale" className="w-5"/>
                    <span>Sell</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="rent" className="w-5"/>
                    <span>Rent</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="parking" className="w-5"/>
                    <span>Parking Spot</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="furnished" className="w-5"/>
                    <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="offer" className="w-5"/>
                    <span>Offer</span>
                </div>
            </div>
            {/* 2nd div */}
            <div className="flex gap-6 flex-wrap">
                <div className="flex gap-2 items-center">
                    <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bedrooms' min='1' max='10' required/>
                    <p>Beds</p>
                </div>
                <div className="flex gap-2 items-center">
                    <input className="p-3 border border-gray-300 rounded-lg" type="number" id='bathrooms' min='1' max='10'required/>
                    <p>Bath</p>
                </div>
                <div className="flex gap-2 items-center">
                    <input className=" p-3 border border-gray-300 rounded-lg" type="number" id='regularPrice' min='1' max='10'required/>
                    <div className="flex flex-col items-center">
                        <p>Regular price</p>
                        <span className="text-xs">(₱ / Month)</span>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <input className="border border-gray-300 rounded-lg p-3" type="number" id='discountedPrice' min='1' max='10'required/>
                    <div className="flex flex-col items-center">
                        <p>Discounted price</p>
                        <span className="text-xs">(₱ / Month)</span>
                    </div>
                </div>
            </div>
        </div>
        {/* 2nd div */}
        <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">Images:
                <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span> 
            </p>
            <div className="flex gap-4 ">
                <input onChange={(e) => setFiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple/>
                <button type="button" 
                disabled={uploading}
                onClick={handleImageSubmit} 
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
                   {uploading ? "Uploading..." : 'Upload'}
                </button>
            </div>
            <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((urls, index) => (
                    <div key={urls} className="flex justify-between p-3 border items-center">
                        <img src={urls} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                        <button type="button" onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg hover:opacity-75">Delete</button>
                    </div>
                    
                ))  
            }
            <button className="p-3 rounded-lg bg-slate-700 text-white uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
        </div>
    </form>
    </main>
  )
}
