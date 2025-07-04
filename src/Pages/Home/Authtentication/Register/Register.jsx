import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../../Hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../../Hooks/useAxios';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {createUser,updateUserProfile}=useAuth();
    const [profilePic, setProfilePic]=useState('');
    const axiosInstance=useAxios();

    const location = useLocation();
  const navigate  = useNavigate();
  const from = location.state?.from?.pathname || '/'; 


    const onSubmit = data => {
        console.log(data);
        // console.log(createUser);
        createUser(data.email,data.password)
        .then(async (result)=>{
            console.log(result.user);
            // update user profile database
            const userInfo={
                email:data.email,
                role:'user',
                created_at: new Date().toISOString(),
                last_log_in:new Date().toISOString(),
            }
            const userRes=await axiosInstance.post('/users', userInfo);
            console.log(userRes.data);


              // update user profile firebase
              const userProfile={
                displayName:data.name,
                photoURL:profilePic
              }
              updateUserProfile(userProfile)
              .then(()=>{
                console.log('profile name pic updated')
                navigate(from);
              })
              .catch(error=>{
                console.log(error)
              })

             
        })
        .catch(error=>{
            console.log(error);
        })
    }
    const handleImageUpload=async(e)=>{
        const image= e.target.files[0];
        console.log(image)
        const formData=new FormData();
        formData.append('image',image);
        const imageUploadUrl=`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
        const res= await axios.post(imageUploadUrl,formData);
        setProfilePic(res.data.data.url);

    }
    return (


        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <h1 className="text-5xl font-bold">Create an Account!</h1>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <fieldset className="fieldset">
                          {/* name */}
                          <label className="label">Your image</label>
                        <input type="file"
                        onChange={handleImageUpload}
                         className="input" placeholder="your profile picture" />
                        {
                            errors.email?.type === 'required' && <p className='text-red-600'>name is required</p>

                        }
                          {/* name */}
                          <label className="label">Your Name</label>
                        <input type="name" {...register('name', { required: true })} className="input" placeholder="your name" />
                      


                        {/* email */}
                        <label className="label">Email</label>
                        <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                        {
                            errors.email?.type === 'required' && <p className='text-red-600'>Email is required</p>

                        }



                        {/* password */}
                        <label className="label">Password</label>
                        <input type="password" className="input" {...register('password', { required: true, minLength: 6 })}
                            placeholder="Password" />
                        {
                            errors.password?.type === 'required' && <p className='text-red-600'>Password is required</p>
                        }
                        {
                            errors.password?.type === 'minLength' && <p className='text-red-600'>password must be 6 character or longer</p>
                        }
                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button className="btn btn-neutral mt-4">Register</button>
                    </fieldset>
                    <p ><small >Already have an Account? <Link    state={{from}} className='btn btn-link' to='/login' >Login</Link></small></p>
                </form>
                <SocialLogin></SocialLogin>
            </div>
        </div>

    );
};

export default Register;