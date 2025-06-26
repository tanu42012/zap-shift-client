import React from 'react';
import Banner from '../Banner/Banner';
import Services from './Services/Services';
import ClientLogosMarquee from '../ClientLogoMarqur/ClientLogosMarquee';
import BenefitsSection from '../Benefits/BenefitsSection';
import BeMerchant from '../BeMerchant/BeMerchant';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Services></Services>
            <ClientLogosMarquee></ClientLogosMarquee>
            <BenefitsSection></BenefitsSection>
            <BeMerchant></BeMerchant>
         
        </div>
    );
};

export default Home;