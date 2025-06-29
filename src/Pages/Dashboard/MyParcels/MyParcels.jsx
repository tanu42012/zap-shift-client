
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Swal from 'sweetalert2';                     // ➜ NEW
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import {
  AiOutlineEye,
  AiOutlineDollarCircle,
  AiOutlineDelete
} from 'react-icons/ai';
import { useNavigate } from 'react-router';

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate=useNavigate();


  // ───────────────────────────────────────────────────
  // fetch parcels for this user
  // ───────────────────────────────────────────────────
  const {
    data: parcels = [],
    isLoading,
    refetch                           // ➜ needed after delete
  } = useQuery({
    queryKey: ['my-parcels', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    }
  });

  // ───────────────────────────────────────────────────
  // DELETE with confirmation
  // ───────────────────────────────────────────────────
  const handleDelete = (parcel) => {
    Swal.fire({
      title: 'Delete this parcel?',
      html: `<p><strong>${parcel.title}</strong><br/>Tracking ID: ${parcel.trackingId}</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await axiosSecure.delete(`/parcels/${parcel._id}`);

        Swal.fire('Deleted!', 'Parcel removed successfully.', 'success');
        refetch();                         // 🔄 refresh list
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete parcel.', 'error');
      }
    });

   
  };
  const handlePay = (id) => {
    console.log("Paying for parcel with ID:", id);
    navigate(`/dashboard/payment/${id}`);
  };

  if (isLoading) return <p className="text-center p-8">Loading…</p>;

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Title</th>
            <th>Cost&nbsp;(৳)</th>
            <th>Created&nbsp;At</th>
            <th>Payment</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {parcels.map((p, idx) => (
            <tr key={p._id}>
              <td>{idx + 1}</td>
              <td className="capitalize">
                {p.parcelType === 'document' ? 'Document' : 'Non-Document'}
              </td>
              <td>{p.title}</td>
              <td>{p.cost}</td>
              <td>{new Date(p.creation_date).toLocaleString()}</td>
              <td>
                <span
                  className={
                    'badge ' +
                    (p.payment_status === 'paid'
                      ? 'badge-success'
                      : 'badge-error')
                  }
                >
                  {p.payment_status}
                </span>
              </td>

              <td className="flex justify-end gap-2">
                <button
                  className="btn btn-sm btn-outline"
                  title="View details"
                /* onClick={() => … } */               /* hook up if needed */
                >
                  <AiOutlineEye />
                </button>

                <button
                  className="btn btn-sm btn-primary"
                  disabled={p.payment_status === 'paid'}
                  onClick={() => handlePay(p._id)}
                  title="Pay"
                >
                  <AiOutlineDollarCircle />
                </button>

                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(p)}         // ➜ NEW
                  title="Delete"
                >
                  <AiOutlineDelete />
                </button>
              </td>
            </tr>
          ))}

          {parcels.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-8">
                No parcels found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcels;
