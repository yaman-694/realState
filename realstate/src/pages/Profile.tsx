import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../redux/hooks'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../firebase';

export default function Profile() {
    const { currentUser } = useAppSelector((state) => state.user);
    const [file, setFile] = useState<File | undefined>();
    const [formData, setFormData] = useState({});
    const [filePrec, setFilePrec] = useState<number>(0);
    const [fileUrl, setFileUrl] = useState<string|undefined>(currentUser!.avatar);
    const [fileError, setFileError] = useState<string>('');

    const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files![0]);
    }
    const fileRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (file)
        handleFileUpload(file);
    }, [file])
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
                console.log(Math.round(progress), filePrec);
            },
            (error) => {
                setFileError(error.message);
                console.log(error.message, fileError);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                setFileUrl(downloadURL);
                setFormData({
                    ...formData,
                    avatar: downloadURL
                })
                console.log('File available at', formData);
            }
        )
    }
    return (
        <div className='profileContainer'>
            <h1 className='pageHeading'>Profile</h1>
            <form className='profileForm'>
                <input type="file" name="avatar" id="avatar" accept="image/png, image/jpeg" hidden ref={fileRef} onChange={handleClick} />
                <img onClick={() => fileRef.current?.click()} src={fileUrl} alt="profile" />
                <input type="text" placeholder='username' id='username' />
                <input type="email" placeholder='email' id='email' />
                <input type="password" placeholder='password' id='password' />
                <button>Update</button>
            </form>
            <div className='footerContainer'>
                <span>Delete Account</span>
                <span>Sign Out</span>
            </div>
        </div>
    )
}