import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  // fetch info of the landlord from the backend api
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  // set message
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <img
            src={landlord.avatar || 'default_avatar_url'}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border"
          />
          <p className="">
            Contact:
            <span className="font-semibold">{landlord.username} </span>
            for{' '}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <div className="flex flex-col">
            {/* Display profile information of the user who needs to be contacted */}
            <p>
              User to be Contacted:
              <span className="font-semibold">{landlord.username}</span>
            </p>
            <p>Email: {landlord.email}</p>
            {/* Add more profile information as needed */}
          </div>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter message here...."
            className="w-full border border-gray-300 rounded-lg p-3"
          ></textarea>
          {/* Send mail to the landlord's email */}
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-blue-900 text-white rounded-lg text-center p-3 uppercase hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
