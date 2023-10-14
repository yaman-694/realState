import { ListingProps } from './Contact'
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function ListingItem({ listing }: ListingProps) {
    return (
        <div className='listing-item-container'>
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover" className='card-img-cover'/>
                <div className='listing-item-info'>
                    <p className='info name'>{listing.name}</p>
                    <div className='add-container'>
                        <MdLocationOn className='add-icon' />
                        <p className='address'>
                            {listing.address}
                        </p>
                    </div>
                    <p className='description'>
                        {listing.description}
                    </p>
                    <p className='price font-semibold'>
                        $
                        {listing.offer
                            ? listing.discountPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                    </p>
                    <div className='features'>
                        <div className='font-semibold'>
                            {listing.bedrooms > 1
                                ? `${listing.bedrooms} beds `
                                : `${listing.bedrooms} bed `}
                        </div>
                        <div className='font-semibold'>
                            {listing.bathrooms > 1
                                ? `${listing.bathrooms} baths `
                                : `${listing.bathrooms} bath `}
                        </div>
                    </div>
                </div>

            </Link>
        </div>
    )
}
