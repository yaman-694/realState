import {useState, useEffect} from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
export default function Header() {
    const { currentUser } = useAppSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
        console.log('searchTermFromUrl', searchTermFromUrl);
    }, [location.search]);

    return (
        <header>
            <div className='navBar'>
                <a href="/" className='companyName'>
                    <h1>
                        <span className='first'>Hai</span>
                        <span className='second'>sea</span>
                    </h1>
                </a>

                <form onSubmit={handleSubmit} className='searchBar'>
                    <input type="text" placeholder='Search...' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
                    <button className='search-btn'>
                        <FaSearch className='searchIcon'></FaSearch>
                    </button>
                </form>
                <ul className='navigators'>
                    <Link to='/'>
                        <li>
                            Home
                        </li>
                    </Link>
                    <Link to='/about'>
                        <li>
                            About
                        </li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? <img className="profileImg" src={currentUser.avatar} alt="profile" />
                            : <li>
                                Sign In
                            </li>
                        }
                    </Link>
                </ul>
            </div>
        </header>
    )
}
