import React from 'react';

const ServiceCard = ({ service }) => {
    const{title,description,icon:Icon}=service;
  return (
    <div className="card bg-base-100  hover:bg-blue-300 shadow-md hover:shadow-xl transition duration-300">
      <div className="card-body items-center text-center">
        <Icon className="text-4xl text-primary mb-3" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
