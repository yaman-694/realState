import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/oAuth';

export default function SignIn() {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({email: null, password: null});
    const {loading,error} = useAppSelector((state)=> state.user);
    const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            if (!formData.email || !formData.password) {
                return;
            }
            dispatch(signInStart());
            console.log(loading);
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            const data = await response.json();
            if(data.success===false){
                dispatch(signInFailure(data.message));
                console.log(error);
                return;
            }
            dispatch(signInSuccess(data));
            navigate('/home');

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className='signUpForm'>
                <h1 className='pageHeading'>Sign In</h1>
                <input type="email" name="email" id="email" placeholder='email' onChange={handleChange}/>
                <input type="password" name="password" id="password" placeholder='password' onChange={handleChange}/>
                <button disabled={loading} className='manualButton'>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
            <OAuth/>
            </form>
            <div className="signUpForm">
                <p>Dont have an account?</p>
                <Link to={'/signup'}>
                    <span>Sign Up</span>
                </Link>
                {error && <p style={{color: "red"}}>{error}</p>}
            </div>
        </div>
    )
}