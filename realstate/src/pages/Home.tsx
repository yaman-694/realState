import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Listing } from './updateList';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
export default function Home() {
    const [offerListings, setOfferListings] = useState<Listing[]>([]);
    const [rentListings, setRentListings] = useState<Listing[]>([]);
    const [saleListings, setSaleListings] = useState<Listing[]>([]);
    SwiperCore.use([Navigation]);
    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('/api/listing/get?offer=true&limit=4');
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings();
            } catch (error) {
                console.log(error);
            }
        };
        const fetchRentListings = async () => {

            try {
                const res = await fetch('/api/listing/get?type=rent&limit=5');
                const data = await res.json();
                setRentListings(data);
                fetchSaleListings();
            } catch (error) {
                console.log(error);
            }
        };

        const fetchSaleListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=sale&limit=5');
                const data = await res.json();
                setSaleListings(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchOfferListings();
    }, []);
    return (
        <div className='home-container'>
            <section className='top'>
                <div className="top-content container">
                    <h1 className='top-heading'>
                        Find your next <span className=''>perfect</span>
                        <br />
                        place with ease
                    </h1>
                    <div className='sub-heading'>
                        Sahand Estate is the best place to find your next perfect place to
                        live.
                        <br />
                        We have a wide range of properties for you to choose from.
                    </div>
                    <Link
                        to={'/search'}
                        className=''
                    >
                        Let's get started...
                    </Link>
                </div>
            </section>
            <section className='swiper-home'>
                <Swiper navigation>
                    {
                        offerListings && offerListings.length > 0 && offerListings.map((listing) => (
                            <SwiperSlide key={listing._id}>
                                <div
                                    style={{
                                        height: '50vh',
                                        background: `url(${listing.imageUrls[0]}) center no-repeat`,
                                        backgroundSize: 'cover',
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </section>
            <section className='container listing'>
                {offerListings && offerListings.length > 0 && (
                    <div className='listing-type'>
                        <div className='heading-container'>
                            <h2 className='listing-heading'>Recent offers</h2>
                            <Link className='show-more' to={'/search?offer=true'}>Show more offers</Link>
                        </div>
                        <div className='listing-results'>
                            {offerListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
                {rentListings && rentListings.length > 0 && (
                    <div className='listing-type'>
                        <div className='heading-container'>
                            <h2 className='listing-heading'>Recent places for rent</h2>
                            <Link className='show-more' to={'/search?type=rent'}>Show more places for rent</Link>
                        </div>
                        <div className='listing-results'>
                            {rentListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
                {saleListings && saleListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {saleListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
            </section>
            <footer />
        </div>
    )
}