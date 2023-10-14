import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Listing } from './updateList';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import 'swiper/css/bundle';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const { currentUser } = useAppSelector((state) => state.user);
    const params = useParams<{ listingId: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const [listing, setListing] = useState<Listing>();
    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    return;
                }
                setListing(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        fetchListings();
    }, [params.listingId])
    return (
        <>
            {loading && <h1 className='pageHeading'>Loading...</h1>}
            {error && <h1 className='pageHeading'>Error...</h1>}
            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    style={{
                                        height: '50vh',
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover',
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='share-btn'>
                        <FaShare
                            className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className='copied-text'>
                            Link copied!
                        </p>
                    )}

                    <div className="content-container">
                        <p className='item-name'>
                            {listing.name} - ${' '}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className='item-address'>
                            <FaMapMarkerAlt className='add-icon' />
                            {listing.address}
                        </p>
                        <div className="btn-container">
                            <p className='rent-btn'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className='discount-btn'>
                                    ${+listing.regularPrice - +listing.discountPrice} OFF
                                </p>
                            )}
                        </div>
                        <p className='description'><strong>Description - </strong>{listing.description}</p>
                        <ul className='features'>
                            <li className=''>
                                <FaBed className='' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} beds `
                                    : `${listing.bedrooms} bed `}
                            </li>
                            <li className=''>
                                <FaBath className='' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths `
                                    : `${listing.bathrooms} bath `}
                            </li>
                            <li className=''>
                                <FaParking className='' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className=''>
                                <FaChair className='' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button
                                onClick={() => setContact(true)}
                                className='contact-btn'
                            >
                                Contact landlord
                            </button>
                        )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            )}
        </>
    )
}
