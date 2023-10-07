import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/oAuth';


export default function SignUp() {
    
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
            setLoading(true);
            console.log(formData);
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            const data = await response.json();
            console.log(data);
            if(data.success===false){
                setError(data.message);
                setLoading(false);
                return;
            }
            setLoading(false);
            setError('');
            navigate('/signin');
            console.log(data);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className='signUpForm'>
                <h1 className='pageHeading'>Sign Up</h1>
                <input type="text" name="username" id="username" placeholder='username' onChange={handleChange}/>
                <input type="email" name="email" id="email" placeholder='email' onChange={handleChange}/>
                <input type="password" name="password" id="password" placeholder='password' onChange={handleChange}/>
                <input type="password" name="confirm_password" id="confirm_password" placeholder='confirm password' onChange={handleChange}/>
                <button className='manualButton' disabled={loading}>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                <OAuth/>
            </form>
            <div className="signUpForm">
                <p>Have an account?</p>
                <Link to={'/singin'}>
                    <span>Sign Up</span>
                </Link>
            </div>
            {error && <p>{error}</p>}
        </div>
    )
}
