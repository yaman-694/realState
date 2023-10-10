import { app } from "../firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useAppDispatch } from "../redux/hooks";
import {signInSuccess} from '../redux/user/userSlice';
import { useNavigate } from "react-router-dom";
export default function OAuth() {
    const dispatch = useAppDispatch();
    const naivgate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
            })
            const data = await res.json();
            if(data.success === false){
                console.log(data.message);
                return;
            }
            dispatch(signInSuccess(data));
            naivgate('/home')
        } catch (error) {
            console.log(error);
        }
    }

    return (
            <button id='googleSignIn' type='button' onClick={handleGoogleClick}>Sign in with google</button>
    )
}
