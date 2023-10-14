import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Listing } from './updateList';
import ListingItem from '../components/ListingItem';
export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState<Listing[]>([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]);

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex.toString());
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };
    
    const handleChange = (e) => {
        if (
            e.target.id === 'all' ||
            e.target.id === 'rent' ||
            e.target.id === 'sale'
        ) {
            setSidebardata({ ...sidebardata, type: e.target.id });
        }

        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setSidebardata({
                ...sidebardata,
                [e.target.id]:
                    e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebardata({ ...sidebardata, sort, order });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking.toString());
        urlParams.set('furnished', sidebardata.furnished.toString());
        urlParams.set('offer', sidebardata.offer.toString());
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };
    return (
        <div className='search-main-container'>
            <div className="option-container">
                <form onSubmit={handleSubmit} className='option-form'>
                    <div className="search--container">
                        <label className='font-semibold'>Search Term:</label>
                        <input type="text" id="searchTerm" placeholder='Search...'
                            className='input-search' value={sidebardata.searchTerm} onChange={handleChange} />
                    </div>
                    <div className="type--container">
                        <div className="check-box-container check-box-2">
                            <label className='font-semibold'>Type:</label>
                            <div className="checkBox">
                                <input type="checkbox" onChange={handleChange} checked={sidebardata.type === 'all'} id='Rent & Sell' />
                                <span>Rent & Sell</span>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" id='rent' onChange={handleChange} checked={sidebardata.type === 'rent'} />
                                <span>Rent</span>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" id='sale' onChange={handleChange} checked={sidebardata.type === 'sale'} />
                                <span> Sale </span>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" id='offer' onChange={handleChange} checked={sidebardata.offer} />
                                <span> Offer </span>
                            </div>
                        </div>
                        <div className="check-box-container check-box-2">
                            <label className='font-semibold'>Amenities:</label>
                            <div className="checkBox">
                                <input type="checkbox" onChange={handleChange} checked={sidebardata.parking} id='parking' />
                                <span>Parking</span>
                            </div>
                            <div className="checkBox">
                                <input type="checkbox" id='furnished' onChange={handleChange} checked={sidebardata.furnished} />
                                <span>Furnished</span>
                            </div>
                        </div>
                        <div className="check-box-container">
                            <label className='font-semibold'>Sort:</label>
                            <select
                                onChange={handleChange}
                                defaultValue={'created_at_desc'}
                                id='sort_order'
                                className='select-btn'
                            >
                                <option value='regularPrice_desc'>Price high to low</option>
                                <option value='regularPrice_asc'>Price low to hight</option>
                                <option value='createdAt_desc'>Latest</option>
                                <option value='createdAt_asc'>Oldest</option>
                            </select>
                        </div>
                    </div>
                    <button className='btn-search'>
                        Search
                    </button>
                </form>
            </div>
            <div className="listing-container-search">
                <h1 className='font-semibold listing-heading'>
                    Listing results:
                </h1>
                <div className='listing-container-search-in'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>No listing found!</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>
                            Loading...
                        </p>
                    )}

                    {!loading &&
                        listings &&
                        listings.map((listing: Listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}

                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className='show-more-btn'
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
