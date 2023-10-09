import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { set } from "mongoose";
interface FormData {
    imageUrls: [],
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
}
export default function CreateList() {
    const { currentUser } = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState({
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
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
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
            console.log('Max 6 images');
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
            (error)=>{
                console.log(error)
                reject(error);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    console.log('File available at', downloadURL)
                    resolve(downloadURL);
                });
            });
        })
    }

    const handleChange = (e) => {
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
            e.target.type === 'text' ||
            e.target.type === 'textarea'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }

    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(false);
            const response = await fetch('/api/list/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }
            console.log(data);
            setLoading(false);
            navigate('/home');
        } catch (error) {
            setError(true);
        }
    }

    const handleRemoveImage = (index: number) => {

        console.log(index)
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        })
    }
    return (
        <div className="createListContainer">
            <h1 className='pageHeading'>Create List</h1>
            <form onSubmit={handleSubmit} className="createListForm">
                <div className="inputContainer">
                    <input type="text" placeholder="Name" id='name' onChange={handleChange} value={formData.name} />
                    <textarea placeholder="Description" id='description' onChange={handleChange} value={formData.description}></textarea>
                    <input type="text" id='address' placeholder="Address" onChange={handleChange} value={formData.address} />
                    <div className="checkBoxContainer">
                        <div className="checkBox">
                            <input type="checkbox" onChange={handleChange} checked={formData.type === 'sell'} id='sell'/>
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
                        <div className='priceInnerContainer'>
                            <input type="number" id='discountPrice' min='0' max='100000' required onChange={handleChange} value={formData.discountPrice} />
                            <div className='price'>
                                <span>Discount Price</span>
                                <span className='smFont'>($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="imgContainer">
                    <p>Images:
                        <span> The first image will be the cover (max 6)</span>
                    </p>
                    <div className='upload'>
                        <input type="file" accept="image/*" id="images" className="imgInput" onChange={handleImageChange} multiple />
                        <button type='button' onClick={handleImageUpload}id="imgUploadButton" disabled={uploading}>{
                            uploading ? 'Uploading...' : 'Upload'
                        }</button>
                    </div>
                        {imageUploadError && <p style={{color: '#be2416'}}>Max 6 images</p>}
                    {
                        formData.imageUrls.length > 0 && (formData.imageUrls.map((url, index) => {
                            return (
                                <div key={url} className="images-container">
                                    <img src={url} width='150px' alt="photoList" key={url} />
                                    <button type='button' onClick={()=>handleRemoveImage(index)} className='btn'>Delete</button>
                                </div>
                            )
                        }))
                    }
                </div>
                <button disabled={loading}>{
                    loading ? 'Loading...' : 'Create List'
                }</button>
            </form>
        </div>
    )
}
