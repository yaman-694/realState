import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../pages/updateList';
import { User } from '../redux/user/userSlice';
export interface ListingProps {
    listing: Listing;
}

export default function Contact({ listing }: ListingProps) {
    const [landlord, setLandlord] = useState<User>({});
    const [message, setMessage] = useState('');
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

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
    return (
        <>
            {landlord.email && (
                <div className='contact-container'>
                    <p>
                        Contact <span className='font-semibold'>{landlord.username}</span>{' '}
                        for{' '}
                        <span className='font-semibold'>{listing.name.toLowerCase()}</span>
                    </p>
                    <textarea
                        name='message'
                        id='message'
                        rows={2}
                        value={message}
                        onChange={onChange}
                        placeholder='Enter your message here...'
                    ></textarea>
                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className='send-message-btn'
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
}
