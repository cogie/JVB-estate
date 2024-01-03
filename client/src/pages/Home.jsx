import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation, Autoplay]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className="bg-white">
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-blue-900 font-extrabold text-3xl lg:text-6xl">
          Discover Your Dream Home with <span className="text-slate-600">JVBReal Estate</span>
        </h1>
        <p className="text-gray-700 text-sm sm:text-base">
          Explore a wide range of properties and find your perfect home with JVBReal Estate.
        </p>
        <Link
          to={'/search'}
          className="text-sm sm:text-base text-blue-800 font-semibold hover:underline"
        >
          Explore Listings
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation autoplay={{delay: 3000}}>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}
      {/* listing results for offer, sale, and rent */}
<div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
  {offerListings && offerListings.length > 0 && (
    <div className=''>
      <div className='my-3'>
        <h2 className='text-2xl font-semibold text-slate-600 hover:text-blue-800'>
          Recent Offers
        </h2>
        <Link
          className='text-sm text-blue-800 hover:underline cursor-pointer'
          to={'/search?offer=true'}
        >
          Show more offers
        </Link>
      </div>
      <div className='flex flex-wrap gap-4'>
        {offerListings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  )}
  {rentListings && rentListings.length > 0 && (
    <div className=''>
      <div className='my-3'>
        <h2 className='text-2xl font-semibold text-slate-600 hover:text-green-800'>
          Recent Places for Rent
        </h2>
        <Link
          className='text-sm text-green-800 hover:underline cursor-pointer'
          to={'/search?type=rent'}
        >
          Show more places for rent
        </Link>
      </div>
      <div className='flex flex-wrap gap-4'>
        {rentListings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  )}
  {saleListings && saleListings.length > 0 && (
    <div className=''>
      <div className='my-3'>
        <h2 className='text-2xl font-semibold text-slate-600 hover:text-orange-800'>
          Recent Places for Sale
        </h2>
        <Link
          className='text-sm text-orange-800 hover:underline cursor-pointer'
          to={'/search?type=sale'}
        >
          Show more places for sale
        </Link>
      </div>
      <div className='flex flex-wrap gap-4'>
        {saleListings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  )}
</div>



      
      {/* Footer with interactive icons and "All rights reserved" */}
      <footer className="bg-blue-900 text-white py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="text-lg mr-2" />
            <p className="text-sm">jvbrealestate@gmail.com</p>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPhoneAlt} className="text-lg mr-2" />
            <p className="text-sm">+63 945 331 0511</p>
          </div>
          <p className="text-sm">&copy; 2024 JVBReal Estate. All rights reserved.</p>
          {/* <Link to="/contact" className="text-sm hover:underline">
            Contact Us
          </Link> */}
        </div>
      </footer>
    </div>
  );
}
