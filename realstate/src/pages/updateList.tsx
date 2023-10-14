import React, { useState, useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
export interface Listing {
    _id?: string,
    imageUrls: string[],
    name: string,
    description: string,
    address: string,
    type: string,
    bedrooms: number,
    bathrooms: number,
    regularPrice: number,
    discountPrice: number,
    offer: boolean,
    parking: boolean,
    furnished: boolean,
    userRef?: string,
}
export default function UpdateList() {
    const { currentUser } = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState<Listing>({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 100,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const params = useParams();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const filesArray = Array.from(files);
            setFiles(filesArray as File[]);
        }
    }
    const handleImageUpload = () => {
        if (files.length + formData.imageUrls.length < 7 && files.length > 0) {
            setImageUploadError(false);
            setUploading(true);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(uploadImage(files[i]));
            }

            Promise.all(promises).then((urls: unknown[]) => {
                setFormData({
                    ...formData,
                    imageUrls: formData.imageUrls.concat(urls as []),
                });
                setUploading(false);
            }).catch((error) => {
                setImageUploadError(true);
                console.log(error);
            });
        } else {
            setImageUploadError(true);
            setError('Max 6 images');
        }
    }

    const uploadImage = async (file: File) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.log(error)
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL)
                        resolve(downloadURL);
                    });
                });
        })
    }

    const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.id === 'sell' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (
            e.target.type === 'number' ||
            e.target.type === 'text'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }

    };

    const handleSubmit = async () => {
        try {
            setError('');
            if (formData.imageUrls.length === 0) {
                setError('Please upload at least one image');

                return;
            }
            if (formData.regularPrice < formData.discountPrice) {
                console.log(formData.regularPrice, formData.discountPrice)
                setError('Discount price must be lower than regular price');
                return;
            }
            console.log(formData);
            setLoading(true);
            setError('');
            const response = await fetch(`/api/listing/update/${params.listId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await response.json();
            if (data.success === false) {
                setError(data.message);
                console.log(data.message);
                setLoading(false);
                return;
            }
            console.log(data);
            setLoading(false);
            navigate('/listing/' + data._id);
        } catch (error: unknown) {
            error instanceof Error &&
                setError(error.message);
        }
    }

    const handleRemoveImage = (index: number) => {
        setError('');
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        })
    }

    useEffect(() => {
        const fetchListing = async () => {
            setError('');
            const listId = params.listId;
            const response = await fetch(`/api/listing/get/${listId}`);
            const data = await response.json();
            if (data.success === false) {
                setError(data.message);
                return;
            }
            setFormData(data);
            console.log(data);
        }
        fetchListing();
    }, [])

    return (
        <div className="createListContainer">
            <h1 className='pageHeading'>Update List</h1>
            <form onSubmit={handleSubmit} className="createListForm">
                <div className="inputContainer">
                    <input type="text" placeholder="Name" id='name' onChange={handleChange} value={formData.name} required />
                    <textarea placeholder="Description" id='description' onChange={handleChangeText} value={formData.description} required ></textarea>
                    <input type="text" id='address' placeholder="Address" onChange={handleChange} value={formData.address} required />
                    <div className="check-box-container">
                        <div className="checkBox">
                            <input type="checkbox" onChange={handleChange} checked={formData.type === 'sell'} id='sell' />
                            <span>Sell</span>
                        </div>
                        <div className="checkBox">
                            <input type="checkbox" id='rent' onChange={handleChange} checked={formData.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className="checkBox">
                            <input type="checkbox" id='parking' onChange={handleChange} checked={formData.parking} />
                            <span>Parking spot</span>
                        </div>
                        <div className="checkBox">
                            <input type="checkbox" id='furnished' onChange={handleChange} checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className="checkBox">
                            <input type="checkbox" id='offer' onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="counterContainer">
                        <div className='priceInnerContainer'>
                            <input type="number" id='bedrooms' min='1' max='10' required onChange={handleChange} value={formData.bedrooms} />
                            <label>Beds</label>
                        </div>
                        <div className='priceInnerContainer'>
                            <input type="number" id='bathrooms' min='1' max='10' required onChange={handleChange} value={formData.bathrooms} />
                            <label>Baths</label>
                        </div>
                        <div className='priceInnerContainer'>
                            <input type="number" id='regularPrice' min='100' max='1000000' required onChange={handleChange} value={formData.regularPrice} />
                            <div className='price'>
                                <span>Regular Price</span>
                                <span className='smFont'>($ / month)</span>
                            </div>
                        </div>
                        {formData.offer && (
                            <div className='priceInnerContainer'>
                                <input type="number" id='discountPrice' min='0' max='100000' required onChange={handleChange} value={formData.discountPrice} />
                                <div className='price'>
                                    <span>Discount Price</span>
                                    <span className='smFont'>($ / month)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="imgContainer">
                    <p>Images:
                        <span> The first image will be the cover (max 6)</span>
                    </p>
                    <div className='upload'>
                        <input type="file" accept="image/*" id="images" className="imgInput" onChange={handleImageChange} multiple />
                        <button type='button' onClick={handleImageUpload} id="imgUploadButton" disabled={uploading}>{
                            uploading ? 'Uploading...' : 'Upload'
                        }</button>
                    </div>
                    {
                        formData.imageUrls.length > 0 && (formData.imageUrls.map((url, index) => {
                            return (
                                <div key={url} className="images-container">
                                    <img src={url} width='150px' alt="photoList" key={url} />
                                    <button type='button' onClick={() => handleRemoveImage(index)} className='btn'>Delete</button>
                                </div>
                            )
                        }))
                    }
                </div>
                <button disabled={loading}>{
                    loading ? 'Loading...' : 'Update List'
                }</button>
            </form>
        </div>
    )
}
