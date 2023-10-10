import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Listing } from './updateList';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams<{ listingId: string }>();
    const [loading, setLoading] = useState<boolean>(false);
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
        <div>
            {loading && <h1 className='pageHeading'>Loading...</h1>}
            {error && <h1 className='pageHeading'>Error...</h1>}
            {listing && !loading && !error && (
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
            )}
        </div>
    )
}
