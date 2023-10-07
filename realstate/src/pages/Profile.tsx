import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, updateUserFailure, updateUserStart, updateUserSuccess, User } from '../redux/user/userSlice';
import { app } from '../firebase';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { currentUser, loading, error } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const [file, setFile] = useState<File | undefined>();
    const [formData, setFormData] = useState<User>(currentUser);
    const [filePrec, setFilePrec] = useState<number>(0);
    const [fileUrl, setFileUrl] = useState<string>();
    const [fileError, setFileError] = useState<boolean>(false);
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

    const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files![0]);
    };
    const fileRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (file && file?.name.split('.').pop() === 'jpg' || file?.name.split('.').pop() === 'png') {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file: File) => {
        const storage = getStorage(app);
        const metadata = {
            contentType: 'image/*'
        };
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        uploadTask.on('state_changed',
            (snapshots) => {
                const progress = (snapshots.bytesTransferred / snapshots.totalBytes) * 100;
                setFilePrec(Math.round(progress));
            },
            (error) => {
                console.log(error);
                setFileError(true);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                setFileUrl(downloadURL);
                setFormData({
                    ...formData,
                    avatar: downloadURL
                });
            }
        )
    }

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error: unknown) {
            if (error instanceof Error) {
                dispatch(deleteUserFailure(error.message));
            }
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error: unknown) {
            if (error instanceof Error)
                dispatch(deleteUserFailure(error.message));
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser?._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
            } else {
                dispatch(updateUserSuccess(data));
                setUpdateSuccess(true);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='profileContainer'>
            <h1 className='pageHeading'>Profile</h1>
            <form onSubmit={handleSubmit} className='profileForm'>
                <input type="file" name="avatar" id="avatar" accept="image/*" hidden ref={fileRef} onChange={handleClick} />
                <img onClick={() => fileRef.current?.click()} src={fileUrl||currentUser.avatar} alt="profile" />
                <p>
                    {fileError ? (
                        <span>Error Uploading File</span>
                    ) : filePrec > 0 && filePrec < 100 ? (
                        <span>{`Uploading ${filePrec}%...`}</span>
                    ) : filePrec === 100 && !fileError ? (
                        <span>Uploaded</span>
                    ) : ''}
                </p>
                <input type="text" defaultValue={currentUser?.username} onChange={handleChange} placeholder='username' id='username' />
                <input type="email" defaultValue={currentUser?.email} onChange={handleChange} placeholder='email' id='email' />
                <input type="password" onChange={handleChange} placeholder='password' id='password' />
                <button disabled={loading} >
                    {loading ? 'Loading...' : 'Update'}
                </button>
                <Link to={'/create-list'}>
                    CreateList
                </Link>
            </form>
            <div className='footerContainer'>
                <span onClick={handleDeleteUser}>Delete Account</span>
                <span onClick={handleSignOut}>Sign Out</span>
            </div>
            {updateSuccess ? <p>Profile Updated</p> : ''}
            {error ? <p>{error}</p> : ''}
        </div>
    )
}