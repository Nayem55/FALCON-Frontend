import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className='relative h-[100vh]'>
            {/* <img className='w-full h-[50vh] sm:h-auto' src={image} alt=''/> */}
            <div className='absolute top-[40%] left-[10%]'>
                <p className='text-2xl font-bold'>Page Not Found</p>
                <button onClick={()=>navigate("/")} className='border border-secondary px-6 py-2 mt-4 hover:bg-secondary hover:text-primary ease-in-out duration-200'>Return To Home Page</button>
            </div>
        </div>
    );
};

export default NotFound;