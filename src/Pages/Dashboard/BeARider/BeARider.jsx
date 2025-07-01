// import React, { useEffect, useState } from 'react';
// import Swal from 'sweetalert2';
// import { useLoaderData } from 'react-router-dom';
// import useAuth from '../../../Hooks/useAuth';
// import useAxiosSecure from '../../../Hooks/useAxiosSecure';

// const BeARider = () => {
//   const serviceCenters = useLoaderData();
//   console.log(serviceCenters)
// //    loaded via loader
//   const regions = [...new Set(serviceCenters.map(center => center.region))];

//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const [selectedRegion, setSelectedRegion] = useState('');
//   const [districts, setDistricts] = useState([]);

//   const [formData, setFormData] = useState({
//     age: '',
//     region: '',
//     district: '',
//     phone: '',
//     nid: '',
//     bikeBrand: '',
//     bikeRegistration: '',
//   });

// //   Update district options based on selected region
//   useEffect(() => {
//     const relatedDistricts = serviceCenters
//       .filter(sc => sc.region === selectedRegion)
//       .map(sc => sc.district);
//     const uniqueDistricts = [...new Set(relatedDistricts)];
//     setDistricts(uniqueDistricts);
//   }, [selectedRegion, serviceCenters]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (name === 'region') {
//       setSelectedRegion(value);
//       setFormData((prev) => ({ ...prev, district: '' }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const application = {
//       name: user.displayName,
//       email: user.email,
//       ...formData,
//       status: 'pending',
//       appliedAt: new Date(),
//     };
//     console.log(application)

//     axiosSecure.post('/riders',application )
//     .then(res=>{
//       console.log(res.data.insertedId);{
//         Swal.fire('Success!', 'Application submitted successfully.', 'success');

//       }
       

//     }

//     }
  
      


//   };

//   return (
//     <div className="max-w-xl mt-6 mx-auto p-4 bg-white rounded shadow">
//       <h2 className="text-2xl text-center font-bold mb-4">Be a Rider - Application Form</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block font-medium">Name</label>
//           <input type="text" value={user?.displayName || ''} readOnly className="input input-bordered w-full" />
//         </div>
//         <div>
//           <label className="block font-medium">Email</label>
//           <input type="email" value={user?.email || ''} readOnly className="input input-bordered w-full" />
//         </div>
//         <div>
//           <label className="block font-medium">Age</label>
//           <input type="number" name="age" value={formData.age} onChange={handleChange} required className="input input-bordered w-full" />
//         </div>
//         <div>
//           <label className="block font-medium">Phone Number</label>
//           <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="input input-bordered w-full" />
//         </div>
//         <div>
//           <label className="block font-medium">National NID</label>
//           <input type="text" name="nid" value={formData.nid} onChange={handleChange} required className="input input-bordered w-full" />
//         </div>
//         <div>
//           <label className="block font-medium">Region</label>
//           <select name="region" value={formData.region} onChange={handleChange} required className="select select-bordered w-full">
//             <option value="">Select Region</option>
//             {regions.map((region) => (
//               <option key={region} value={region}>
//                 {region}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block font-medium">District</label>
//           <select name="district" value={formData.district} onChange={handleChange} required className="select select-bordered w-full">
//             <option value="">Select District</option>
//             {districts.map((district) => (
//               <option key={district} value={district}>
//                 {district}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block font-medium">Bike Brand</label>
//           <input type="text" name="bikeBrand" value={formData.bikeBrand} onChange={handleChange} required className="input input-bordered w-full" />
//         </div>
//         <div>
//           <label className="block font-medium">Bike Registration Number</label>
//           <input type="text" name="bikeRegistration" value={formData.bikeRegistration} onChange={handleChange} required className="input input-bordered w-full" />
//         </div>
//         <button type="submit" className="btn btn-primary text-black w-full">
//           Submit Application
//         </button>
//       </form>
//     </div>
//   );
// };

// export default BeARider;
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useLoaderData } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const BeARider = () => {
  const serviceCenters = useLoaderData();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedRegion, setSelectedRegion] = useState('');
  const [districts, setDistricts] = useState([]);

  const [formData, setFormData] = useState({
    age: '',
    region: '',
    district: '',
    phone: '',
    nid: '',
    bikeBrand: '',
    bikeRegistration: '',
  });

  const regions = [...new Set(serviceCenters.map(center => center.region))];

  // Update district options based on selected region
  useEffect(() => {
    const relatedDistricts = serviceCenters
      .filter(sc => sc.region === selectedRegion)
      .map(sc => sc.district);
    const uniqueDistricts = [...new Set(relatedDistricts)];
    setDistricts(uniqueDistricts);
  }, [selectedRegion, serviceCenters]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'region') {
      setSelectedRegion(value);
      setFormData((prev) => ({ ...prev, district: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const application = {
      name: user.displayName,
      email: user.email,
      ...formData,
      status: 'pending',
      appliedAt: new Date(),
    };

    try {
      const res = await axiosSecure.post('/riders', application);
     

      if (res.data.insertedId) {
        Swal.fire('Success!', 'Application submitted successfully.', 'success');
        // Optionally clear form
        setFormData({
          age: '',
          region: '',
          district: '',
          phone: '',
          nid: '',
          bikeBrand: '',
          bikeRegistration: '',
        });
        console.log(application);
        setSelectedRegion('');
        setDistricts([]);
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      Swal.fire('Error', 'Something went wrong. Try again later.', 'error');
    }
  };

  return (
    <div className="max-w-xl mt-6 mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl text-center font-bold mb-4">Be a Rider - Application Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input type="text" value={user?.displayName || ''} readOnly className="input input-bordered w-full" />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input type="email" value={user?.email || ''} readOnly className="input input-bordered w-full" />
        </div>
        <div>
          <label className="block font-medium">Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required className="input input-bordered w-full" />
        </div>
        <div>
          <label className="block font-medium">Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="input input-bordered w-full" />
        </div>
        <div>
          <label className="block font-medium">National NID</label>
          <input type="text" name="nid" value={formData.nid} onChange={handleChange} required className="input input-bordered w-full" />
        </div>
        <div>
          <label className="block font-medium">Region</label>
          <select name="region" value={formData.region} onChange={handleChange} required className="select select-bordered w-full">
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">District</label>
          <select name="district" value={formData.district} onChange={handleChange} required className="select select-bordered w-full">
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Bike Brand</label>
          <input type="text" name="bikeBrand" value={formData.bikeBrand} onChange={handleChange} required className="input input-bordered w-full" />
        </div>
        <div>
          <label className="block font-medium">Bike Registration Number</label>
          <input type="text" name="bikeRegistration" value={formData.bikeRegistration} onChange={handleChange} required className="input input-bordered w-full" />
        </div>
        <button type="submit" className="btn btn-primary text-black w-full">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BeARider;

