import { useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable, uploadString } from 'firebase/storage';
import { app } from '../firebase'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom';

export default function CreateListing() {
    const {currentUser} = useSelector(state => state.user);
    const [files, setFiles] = useState([]);
    const navigate  = useNavigate();
    const [imageUploadError, setimageUploadError] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent', //subject to change
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountedPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
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

    //handles storing of data
    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type: e.target.id
            });
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            });
        };

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
        };

    }; 

    //submit data to the backend as json file
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //handles if the data are missing or incomplete
            if(formData.imageUrls.length < 1) return setError('You must upload  at least one image');
            if(+formData.regularPrice < +formData.discountedPrice) return setError('Discounted price must be lower than regular price'); //not working
            setLoading(true);
            setError(false);

            const res = await fetch('/api/listing/create',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                })
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message);
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };
  return (
    <main className="p-3 max-w-4xl mx-auto">
    <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* 1st div */}
        <div className="flex flex-col gap-4 flex-1">
            <input onChange={handleChange} value={formData.name} type="text" placeholder="Name" className="border p-3 rounded-lg" id="name" maxLength="62" minLength="10" required/>
            <textarea onChange={handleChange} value={formData.description} type="text" placeholder="Description" className="border p-3 rounded-lg" id="description" required/>
            <input onChange={handleChange} value={formData.address} type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required/>
            <div className="flex gap-6 flex-wrap">
                <div className="flex gap-2">
                    <input onChange={handleChange} checked={formData.type === 'sale'} type="checkbox" id="sale" className="w-5"/>
                    <span>Sell</span>
                </div>
                <div className="flex gap-2">
                    <input onChange={handleChange} checked={formData.type === 'rent'} type="checkbox" id="rent" className="w-5"/>
                    <span>Rent</span>
                </div>
                <div className="flex gap-2">
                    <input onChange={handleChange} checked={formData.parking} type="checkbox" id="parking" className="w-5"/>
                    <span>Parking Spot</span>
                </div>
                <div className="flex gap-2">
                    <input onChange={handleChange} checked={formData.furnished} type="checkbox" id="furnished" className="w-5"/>
                    <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                    <input onChange={handleChange} checked={formData.offer} type="checkbox" id="offer" className="w-5"/>
                    <span>Offer</span>
                </div>
            </div>
            {/* 2nd div must add contact info from the landlord */} 
            <div className="flex gap-6 flex-wrap">
                <div className="flex gap-2 items-center">
                    <input onChange={handleChange} value={formData.bedrooms} className='p-3 border border-gray-300 rounded-lg' type="number" id='bedrooms' min='1' max='10' required/>
                    <p>Beds</p>
                </div>
                <div className="flex gap-2 items-center">
                    <input onChange={handleChange} value={formData.bathrooms} className="p-3 border border-gray-300 rounded-lg" type="number" id='bathrooms' min='1' max='10'required/>
                    <p>Bath</p>
                </div>
                <div className="flex gap-2 items-center">
                    <input onChange={handleChange} value={formData.regularPrice} className=" p-3 border border-gray-300 rounded-lg" type="number" id='regularPrice' min='0' max='10000000'required/>
                    <div className="flex flex-col items-center">
                        <p>Regular price</p>
                        <span className="text-xs">(₱ / Month)</span>
                    </div>
                </div>
                {formData.offer && (      
                    <div className="flex gap-2 items-center">
                        <input onChange={handleChange} value={formData.discountedPrice} className="border border-gray-300 rounded-lg p-3" type="number" id='discountedPrice' min='50' max='10000000'required/>
                        <div className="flex flex-col items-center">
                            <p>Discounted price</p>
                            <span className="text-xs">(₱ / Month)</span>
                        </div>
                    </div>
                )}    
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
            <button disabled={loading || uploading} className="p-3 rounded-lg bg-slate-700 text-white uppercase hover:opacity-95 disabled:opacity-80">
                {loading ? 'Creating...' : 'Create Listing'}
            </button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
    </form>
    </main>
  )
}
