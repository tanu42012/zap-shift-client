// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import Swal from 'sweetalert2';
// import useAxiosSecure from '../../../Hooks/useAxiosSecure';

// const MakeAdmin = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState('');

//   // 1️⃣ Search Query
//   const {
//     data: users = [],
//     isFetching,
//   } = useQuery({
//     queryKey: ['admin-search', searchTerm],
//     enabled: !!searchTerm,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/users/search?email=${searchTerm}`);
//       return res.data;
//     },
//     staleTime: 0,
//   });

//   // 2️⃣ Mutations
//   const updateRoleMutation = useMutation({
//     mutationFn: async ({ id, role }) => {
//       return await axiosSecure.patch(`/users/${id}/role`, { role });
//     },
//     onSuccess: (_, variables) => {
//       Swal.fire('Success', `User role updated to ${variables.role}`, 'success');
//       queryClient.invalidateQueries(['admin-search', searchTerm]);
//     },
//     onError: () => {
//       Swal.fire('Error', 'Failed to update role', 'error');
//     },
//   });

//   // 3️⃣ Handler
//   const handleRoleChange = async (id, newRole) => {
//     const confirm = await Swal.fire({
//       title: `Are you sure you want to make this user ${newRole}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, do it!',
//     });

//     if (confirm.isConfirmed) {
//       updateRoleMutation.mutate({ id, role: newRole });
//     }
//   };

//   // 4️⃣ UI
//   return (
//     <div className="max-w-4xl mx-auto space-y-6 p-4">
//       <h2 className="text-2xl font-bold">Search & Manage Admins</h2>

//       {/* Search form */}
//       <form
//         className="flex gap-2"
//         onSubmit={(e) => {
//           e.preventDefault();
//           const value = e.target.search.value.trim();
//           setSearchTerm(value);
//         }}
//       >
//         <input
//           name="search"
//           type="email"
//           placeholder="Search by email"
//           className="input input-bordered w-full"
//           required
//         />
//         <button type="submit" className="btn btn-primary">Search</button>
//       </form>

//       {/* Loading state */}
//       {isFetching && <p className="text-center">Searching users…</p>}

//       {/* User table */}
//       {!isFetching && users.length > 0 && (
//         <table className="table w-full table-zebra mt-4">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Email</th>
//               <th>Created At</th>
//               <th>Role</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u, idx) => (
//               <tr key={u._id}>
//                 <td>{idx + 1}</td>
//                 <td>{u.email}</td>
//                 <td>{new Date(u.created_at).toLocaleDateString()}</td>
//                 <td>
//                   <span className={`badge ${u.role === 'admin' ? 'badge-success' : 'badge-ghost'}`}>
//                     {u.role || 'user'}
//                   </span>
//                 </td>
//                 <td>
//                   {u.role === 'admin' ? (
//                     <button
//                       className="btn btn-sm btn-error"
//                       disabled={updateRoleMutation.isLoading}
//                       onClick={() => handleRoleChange(u._id, 'user')}
//                     >
//                       Remove Admin
//                     </button>
//                   ) : (
//                     <button
//                       className="btn btn-sm btn-success"
//                       disabled={updateRoleMutation.isLoading}
//                       onClick={() => handleRoleChange(u._id, 'admin')}
//                     >
//                       Make Admin
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* No result state */}
//       {!isFetching && searchTerm && users.length === 0 && (
//         <p className="text-center text-gray-500">No users found.</p>
//       )}
//     </div>
//   );
// };

// export default MakeAdmin;
import React, { useState, useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

/* small debounce hook */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [input, setInput] = useState('');
  const debouncedTerm = useDebounce(input.trim());

  /* 1️⃣  Search users (runs whenever debouncedTerm changes) */
  const { data: users = [], isFetching } = useQuery({
    queryKey: ['admin-search', debouncedTerm],
    enabled: !!debouncedTerm,                 // don’t fetch on empty
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${debouncedTerm}`);
      return res.data;
    },
    staleTime: 0,
  });

  /* 2️⃣  Mutation to update role */
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: (_, { role }) => {
      Swal.fire('Success', `Role updated to ${role}`, 'success');
      queryClient.invalidateQueries(['admin-search', debouncedTerm]);
    },
    onError: () => Swal.fire('Error', 'Role update failed', 'error'),
  });

  /* 3️⃣  Confirm & call mutation */
  const handleRoleChange = async (user, newRole) => {
    const { isConfirmed } = await Swal.fire({
      title:
        newRole === 'admin'
          ? 'Promote to admin?'
          : 'Remove admin role?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
    });
    if (!isConfirmed) return;

    updateRoleMutation.mutate({ id: user._id, role: newRole });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">
      <h2 className="text-2xl font-bold">Make / Remove Admin</h2>

      {/* live search box */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type an email…"
          className="input input-bordered w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* results */}
      {isFetching && debouncedTerm && (
        <p className="text-center pt-4">Searching…</p>
      )}

      {!isFetching && users.length > 0 && (
        <table className="table table-zebra w-full mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u._id}>
                <td>{idx + 1}</td>
                <td>{u.email}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      u.role === 'admin' ? 'badge-success' : 'badge-ghost'
                    }`}
                  >
                    {u.role || 'user'}
                  </span>
                </td>
                <td>
                  {u.role === 'admin' ? (
                    <button
                      className="btn btn-sm btn-error"
                      disabled={updateRoleMutation.isLoading}
                      onClick={() => handleRoleChange(u, 'user')}
                    >
                      Remove Admin
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-success"
                      disabled={updateRoleMutation.isLoading}
                      onClick={() => handleRoleChange(u, 'admin')}
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isFetching && debouncedTerm && users.length === 0 && (
        <p className="text-center text-gray-500 pt-4">
          No users found
        </p>
      )}
    </div>
  );
};

export default MakeAdmin;

