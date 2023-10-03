import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
export default function Header() {
    return (
        <header>
            <div className='navBar'>
                <a href="/" className='companyName'>
                    <h1>
                        <span className='first'>Zyan</span>
                        <span className='second'>Estate</span>
                    </h1>
                </a>
                <div className='nav2'>
                    <form className='searchBar'>
                        <input type="text" placeholder='Search...' />
                        <FaSearch className='searchIcon'></FaSearch>
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
                        <Link to='/signin'>
                            <li>
                                SignIn
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </header>
    )
}
