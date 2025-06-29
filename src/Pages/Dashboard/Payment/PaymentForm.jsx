import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';





const PaymentForm = () => {
   
    
    const stripe=useStripe();
    const elements=useElements();
    const {parcelId}=useParams();
    // console.log(parcelId);
    const axiosSecure=useAxiosSecure();
    const [error,setError]=useState('');
    const {isPending, data:parcelInfo={}}=useQuery({
        queryKey:['parcels',parcelId],
        queryFn: async()=>{
            const res=await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;

        }
    })
    if(isPending){
        return '...loading';
    }
    // console.log(parcelInfo);
    const amount=parcelInfo.cost;
    const amountInCents=amount*100;
    // console.log(amountInCents);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!stripe || !elements){
            return
        }
        const card=elements.getElement(CardElement)
        if(!card){
            return;
        }
        const{error,paymentMethod}=await stripe.createPaymentMethod({
            type:'card',
            card,

        })
        if(error){
            setError(error.message)
        }
        else{
            setError('');
            console.log('payment method', paymentMethod);
        }
        //step-2 create payment intent
        // const result=await axiosSecure.post('/create-payment-intent',{
        //     amountInCents,
        //     parcelId


        // })
        const res = await axiosSecure.post('/create-payment-intent', {
             amountInCents,  // ✅ Use 'amount' as Stripe expects
            parcelId                // Optional: use if your server handles this
          });
          const clientSecret=res.data.clientSecret;
          const result=await stripe.confirmCardPayment(clientSecret,{
            payment_method:{
                card:elements.getElement(CardElement),
                billing_details:{
                    name:'jenny rosen',
                }
            }
          });
          if(result.error){
            console.log(result.error.message);

          }
          else{
            if(result.paymentIntent.status==='succeeded'){
                console.log('payment succeeded');
                console.log(result)
            }
          }
         
        // console.log('res for intent',res)
    
    
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className='space-y-6 border-t-white rounded-xl shadow-md w-full max-w-md  mx-auto'> 
                <CardElement className='p-2 mt-6 border rounded'>
                    
                </CardElement>
                <button
                     type='submit'
                     className='btn btn-primary text-black w-full' 
                     disabled={!stripe}>
                        Pay ${amount}
                    </button>
                    {
                        error && <p className='text-red-600'>{error}</p>
                    }

            </form>

            
        </div>
    );
};

export default PaymentForm;