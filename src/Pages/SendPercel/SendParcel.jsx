import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

function generateTrackingId() {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4-char random
    return `TRK-${timestamp}-${randomPart}`;
}

export default function SendParcel() {
    const serviceCenters = useLoaderData();
    const regions = [...new Set(serviceCenters.map(center => center.region))];

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm();
    const { user } = useAuth();
    // console.log(user);
    const axiosSecure=useAxiosSecure();
    const navigate=useNavigate()

    const [cost, setCost] = useState(null);
    const [formData, setFormData] = useState(null);

    const parcelType = watch("parcelType");
    const senderRegion = watch("senderRegion");
    const receiverRegion = watch("receiverRegion");

    useEffect(() => {
        setValue("senderName", "John Doe"); // Auto-fill name
    }, [setValue]);

    const calculateCost = (data) => {
        const isSameDistrict = data.senderServiceCenter === data.receiverServiceCenter;
        const isDocument = data.parcelType === 'document';
        const weight = parseFloat(data.weight || '0');

        if (isDocument) {
            return isSameDistrict ? 60 : 80;
        }

        if (weight <= 3) {
            return isSameDistrict ? 110 : 150;
        } else {
            const extraKg = weight - 3;
            const extraCharge = extraKg * 40;
            const base = isSameDistrict ? 110 : 150;
            const outExtra = isSameDistrict ? 0 : 40;
            return base + extraCharge + outExtra;
        }
    };

    const onSubmit = (data) => {
        const isSameDistrict = data.senderServiceCenter === data.receiverServiceCenter;
        const isDocument = data.parcelType === 'document';
        const weight = parseFloat(data.weight || '0');

        let base = 0;
        let extra = 0;
        let total = 0;
        let breakdown = '';

        if (isDocument) {
            base = isSameDistrict ? 60 : 80;
            total = base;
            breakdown = `Document Delivery<br>Location: ${isSameDistrict ? 'Same District (৳60)' : 'Different District (৳80)'}`;
        } else {
            if (weight <= 3) {
                base = isSameDistrict ? 110 : 150;
                total = base;
                breakdown = `Non-Document (≤3kg)<br>Location: ${isSameDistrict ? 'Same District (৳110)' : 'Different District (৳150)'}`;
            } else {
                const extraKg = weight - 3;
                base = isSameDistrict ? 110 : 150;
                extra = extraKg * 40 + (isSameDistrict ? 0 : 40);
                total = base + extra;

                breakdown = `Non-Document (>3kg)<br>
        Base: ৳${base}<br>
        Extra Charge for ${extraKg}kg: ৳${extraKg * 40}${isSameDistrict ? '' : ' + ৳40 (out-of-district fee)'}`;
            }
        }

        setCost(total);
        setFormData(data);

        Swal.fire({
            title: `Total Delivery Cost: <strong>৳${total}</strong>`,
            html: `
        <div style="text-align:left">
          <p>${breakdown}</p>
          <hr/>
          <p><strong>Total: ৳${total}</strong></p>
        </div>
      `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Proceed to Payment',
            cancelButtonText: 'Go Back to Edit',
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirm(data, total);
            }
        });
    };

    const handleConfirm = (data, cost) => {
        const trackingId = generateTrackingId(); // ✅ generate it here

        const payload = {
            ...data,
            trackingId, // ✅ include it here
            cost,
            created_by: user?.email,
            payment_status: 'unpaid',
            delivery_status: 'not collected',
            creation_date: new Date().toISOString()
        };

        // console.log("Saving to database:", payload);
        axiosSecure.post('/parcels', payload)
        .then(res=>{
            console.log(res.data);
            if(res.data.insertedId){
               

                Swal.fire({
                    title:'Redirecting..',
                    text:'proceeding to payment gateway',
                    timer:1500,
                })
                navigate('/dashboard/myParcels');
            }
        })


        Swal.fire({
            title: 'Parcel Confirmed ✅',
            html: `
        <p>Your Tracking ID:</p>
        <h2 class="text-lg font-bold">${trackingId}</h2>
      `,
            icon: 'success',
            confirmButtonText: 'Done'
        });

        toast.success("Parcel info saved successfully!");
        setCost(null);
        setFormData(null);
        reset();
    };


    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded space-y-6">
            <h1 className="text-2xl font-bold text-center">Send a Parcel</h1>
            <p className="text-gray-600 text-center">Fill in the form to schedule your delivery.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Parcel Info */}
                <section>
                    <h2 className="text-lg font-semibold">Parcel Info</h2>
                    <div className="space-y-3">
                        <label className="block font-medium">Parcel Type:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="document"
                                    {...register("parcelType", { required: true })}
                                    className="radio radio-primary"
                                />
                                Document
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="non-document"
                                    {...register("parcelType", { required: true })}
                                    className="radio radio-primary"
                                />
                                Non-Document
                            </label>
                        </div>
                        <input {...register("title", { required: true })} type="text" placeholder="Parcel Title" className="input w-full" />
                        {parcelType === "non-document" && (
                            <input {...register("weight", { required: true })} type="number" placeholder="Weight (kg)" className="input w-full" />
                        )}
                    </div>
                </section>

                {/* Sender Info */}
                <section>
                    <h2 className="text-lg font-semibold">Sender Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input {...register("senderName", { required: true })} className="input w-full bg-gray-100" />
                        <input {...register("senderContact", { required: true })} placeholder="Contact" className="input w-full" />

                        <select {...register("senderRegion", { required: true })} className="select w-full">
                            <option value="">Select Region</option>
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>

                        <select {...register("senderServiceCenter", { required: true })} className="select w-full">
                            <option value="">Select Service Center</option>
                            {serviceCenters
                                .filter(center => center.region === senderRegion)
                                .map(center => (
                                    <option key={center.id} value={center.district}>{center.name} ({center.district})</option>
                                ))}
                        </select>

                        <textarea {...register("senderAddress", { required: true })} placeholder="Address" className="textarea w-full" />
                        <textarea {...register("pickupInstruction")} placeholder="Pickup Instruction" className="textarea w-full" />
                    </div>
                </section>

                {/* Receiver Info */}
                <section>
                    <h2 className="text-lg font-semibold">Receiver Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input {...register("receiverName", { required: true })} placeholder="Name" className="input w-full" />
                        <input {...register("receiverContact", { required: true })} placeholder="Contact" className="input w-full" />

                        <select {...register("receiverRegion", { required: true })} className="select w-full">
                            <option value="">Select Region</option>
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>

                        <select {...register("receiverServiceCenter", { required: true })} className="select w-full">
                            <option value="">Select Service Center</option>
                            {serviceCenters
                                .filter(center => center.region === receiverRegion)
                                .map(center => (
                                    <option key={center.id} value={center.district}>{center.name} ({center.district})</option>
                                ))}
                        </select>

                        <textarea {...register("receiverAddress", { required: true })} placeholder="Address" className="textarea w-full" />
                        <textarea {...register("deliveryInstruction")} placeholder="Delivery Instruction" className="textarea w-full" />
                    </div>
                </section>

                <button type="submit" className="btn btn-primary text-black w-full">Submit Parcel</button>
            </form>

            <ToastContainer />
        </div>
    );
}
