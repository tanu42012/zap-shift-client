// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useLocation, useNavigate } from 'react-router';
// import SocialLogin from '../SocialLogin/SocialLogin';
// import useAuth from '../../../../Hooks/useAuth';

// const Login = () => {
//     const { register, handleSubmit, formState: { errors } } = useForm();
//     const{signIn}=useAuth();
//     const location=useLocation();

//     console.log(location);
//     const navigate=useNavigate();

//     const from=location.state?.from || '/'
//     const onSubmit = data => {
//         signIn(data.email,data.password)
//         .then(result=>{
//             console.log(result);
//             // navigate(from);
//         })
//         .catch(error=>{
//             console.log(error)
//         })

//     return (
//         <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
//             <div className="card-body">
//                 <h1 className="text-5xl font-bold">Please Login!</h1>
//                 <form onSubmit={handleSubmit(onSubmit)} >
//                     <fieldset className="fieldset">
//                         <label className="label">Email</label>
//                         <input type="email" {...register('email')} className="input" placeholder="Email" />

//                         <label className="label">Password</label>
//                         <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />
//                         {
//                             errors.password?.type === 'required' && <p className='text-red-600'>password is required</p>
//                         }
//                         {
//                             errors.password?.type === 'minLength' && <p className='text-red-600'>password must be 6 character or longer</p>
//                         }


//                         <div><a className="link link-hover">Forgot password?</a></div>
//                         <button className="btn btn-neutral mt-4">Login</button>



//                     </fieldset>
//                     <p ><small >New to this website? <Link className='btn btn-link' to='/register' >Register</Link></small></p>
                    
//                 </form>
//                 <SocialLogin></SocialLogin>
//             </div>
//             </div>
//             );
// };

//             export default Login;
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';   // ✅ react-router-dom
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../../Hooks/useAuth';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn } = useAuth();

  const location = useLocation();
  const navigate  = useNavigate();
  const from = location.state?.from?.pathname || '/';                // ✅ use .pathname

  // ---------- handlers ----------
  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);                       // ✅ await the promise
      navigate(from, { replace: true });                             // ✅ redirect after login
    } catch (err) {
      console.error(err);                                            // you can surface UI errors here
    }
  };

  // ---------- ui ----------
  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Please Login!</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="input"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}

            <label className="label">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be 6 characters or longer' },
              })}
              className="input"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-600">{errors.password.message}</p>}

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-neutral mt-4">Login</button>
          </fieldset>
        </form>

        <p className="mt-2">
          <small>
            New to this website?
            <Link className="btn btn-link p-0 ml-1" to="/register">Register</Link>
          </small>
        </p>

        <SocialLogin />
      </div>
    </div>
  );
};

export default Login;
