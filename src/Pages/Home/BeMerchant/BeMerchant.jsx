import React from 'react';
import location from '../../../assets/assets/location-merchant.png'

const BeMerchant = () => {
    return (
        <div  className=" bg-[url('assets/assets/be-a-merchant-bg.png')] bg-[#03373D] p-20 bg-no-repeat ">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                    src={location}
                    className="max-w-sm rounded-lg shadow-2xl"
                />
                <div>
                    <h1 className="text-5xl text-white font-bold">Merchant and Customer Satisfaction is Our First Priority</h1>
                    <p className="py-6  text-white">
                    We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                    </p>
                    <div className=''>
                    <button className="btn btn-primary rounded-full text-black">Become a Merchant</button>
                    <button className="btn btn-primary rounded-full ms-4 text-black">Earn With Profast Courier</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeMerchant;