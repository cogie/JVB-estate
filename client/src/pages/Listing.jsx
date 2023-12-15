import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react'; 
import  SwiperCore  from "swiper";
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {useSelector} from 'react-redux'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaSearch,
    FaShare,
  } from 'react-icons/fa';

export default function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    SwiperCore.use([Navigation]);
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user); 

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json();
                //if success false
                if (data.success === false) {
                    setError(true);
                    setLoading(false);  
                    return;
                }
                setListing(data); // if success === true
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);
    console.log(loading)
  return (
    <main>
        {/* loading effect end error */}
        {loading && <p className="text-center my-7 text-2xl">Loading...</p>} 
        {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}  

         {/*show img at the top  */}
         {listing && !loading && !error && (
                // swiper
                <div>
                    {/* need to add autoplay swiper */}
                    <Swiper navigation> 
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[450px]" 
                                style = {{ 
                                    background: `url(${url}) center no-repeat`,
                                    backgourndSize: 'cover' }}>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center
                    items-center bg-slate-100 cursor-pointer">
                        <FaShare
                            className="text-slate-500"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                            Link copied!
                        </p>
                    )}
                    <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                        <p className="text-2xl font-semibold">
                            {listing.name} - ₱{' '}
                            {listing.offer
                                ? listing.discountedPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')
                            }
                            {listing.type === 'rent' && '/ month'}
                        </p>
                        <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
                            <FaMapMarkerAlt className="text-green-700"/>
                            {listing.address}
                        </p>
                        <div className="flex gap-4 ">
                            <p className="bg-red-700 text-white w-full max-w-[200px] text-center p-1 rounded-md">
                                {listing.type === 'rent' ? 'For rent' : 'For sale'}
                            </p>
                            {   //theres a problem in offer while setting it/ must fix
                                listing.offer && (
                                    <p className="bg-green-700 text-white w-full max-w-[200px] text-center p-1 rounded-md"> 
                                        ₱{+listing.regularPrice -  +listing.discountedPrice} OFF
                                    </p>
                                )
                            }
                        </div>
                        <p className="text-slate-800 "> 
                            <span className="font-semibold text-black">
                                Description - {' '}
                            </span>
                            {listing.description}
                        </p>
                        <ul className="text-green-900 font-semibold text-sm gap-4 sm:gap-6 flex items-center flex-wrap ">
                            <li className="flex items-center gap-1 whitespace-nowrap ">
                                <FaBed className="text-lg"/>
                                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : ` 
                                ${listing.bedrooms} bed`}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap ">
                                <FaBath className="text-lg"/>
                                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : ` 
                                ${listing.bathrooms} bath`}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap ">
                                <FaParking className="text-lg"/>
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap ">
                                <FaChair className="text-lg"/>
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        <button className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-5">
                            Contact Landlord
                        </button>
                    </div>
                </div>
            )
         }
    </main>
  )
}
