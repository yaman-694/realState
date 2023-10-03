import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
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
            const response = await fetch('/api/auth/signin', {
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
            navigate('/home');
            console.log(data);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className='signUpForm'>
                <h1 className='signUpHeading'>Sign In</h1>
                <input type="email" name="email" id="email" placeholder='email' onChange={handleChange}/>
                <input type="password" name="password" id="password" placeholder='password' onChange={handleChange}/>
                <button disabled={loading}>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
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