import React from 'react';
import Image from 'next/image';

const DemoImage = () => {
    return (
        <div>
            <Image className='h-auto w-auto' src="/codecayonImage/workdemo.png" alt="" />
        </div>
    );
};

export default DemoImage;