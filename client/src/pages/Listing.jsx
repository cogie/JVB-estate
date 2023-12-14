import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react'; 
import  SwiperCore  from "swiper";
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    SwiperCore.use([Navigation]);

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
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[550px]" 
                                style = {{ background: `url(${url}) center
                                no-repeat`,
                                backgourndSize: 'cover' }}>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                
            )
         }
    </main>
  )
}
