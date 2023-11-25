import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom'


export default function () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick  = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth =  getAuth(app);

            //sign up with pop-up
            const result = await signInWithPopup(auth, provider);

            //send data to backend/ endpoint
            const res = await fetch('/api/auth/google',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName, 
                    email: result.user.email, 
                    photo: result.user.photoURL}),
            });
            const data  = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log('Could not sign in with google', error);   
        }
    };


  return (
        <button onClick={handleGoogleClick} type='button' className='uppercase bg-red-700 p-3 rounded-lg text-white hover:opacity-95'>Continue with google</button>
  )
}
