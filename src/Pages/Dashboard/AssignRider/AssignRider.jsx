// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import useAxiosSecure from '../../../Hooks/useAxiosSecure';
// import Swal from 'sweetalert2';

// const AssignRider = () => {
//     const axiosSecure = useAxiosSecure();

//     /* 🔄 Fetch parcels ready for rider assignment */
//     const { data: parcels = [], isLoading } = useQuery({
//         queryKey: ['assignable-parcels'],
//         queryFn: async () => {
//             const res = await axiosSecure.get(
//                 '/parcels?payment_status=paid&delivery_status=not%20collected'
//             );
//             return res.data;
//         },
//         staleTime: 0,
//     });

//     /* Placeholder for future assign logic */
//     const handleAssign = (parcel) => {
//         Swal.fire('TODO', `Assign Rider for ${parcel.trackingId}`, 'info');
//         // later: open modal / call mutation / etc.
//     };

//     if (isLoading) {
//         return <p className="text-center py-6">Loading parcels…</p>;
//     }

//     return (
//         <div className="overflow-x-auto w-full p-4">
//             <h2 className="text-2xl font-bold mb-4">Parcels Awaiting Rider</h2>

//             <table className="table table-zebra w-full">
//                 <thead>
//                     <tr>
//                         <th>#</th>
//                         <th>Tracking ID</th>
//                         <th>Title</th>
//                         <th>senderRegion</th>
//                         <th>receiverRegion</th>
//                         <th>Cost (৳)</th>
//                         <th>Created At</th>
//                         <th className="text-right">Action</th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {parcels.map((p, idx) => (
//                         <tr key={p._id}>
//                             <td>{idx + 1}</td>
//                             <td>{p.trackingId}</td>
//                             <td>{p.title}</td>
//                             <td>{p.senderRegion}</td>
//                             <td>{p.receiverRegion}</td>
//                             <td>{p.cost}</td>
//                             <td>{new Date(p.creation_date).toLocaleString()}</td>
//                             <td className="flex justify-end">
//                                 <button
//                                     className="btn btn-sm btn-primary text-black"
//                                     onClick={() => handleAssign(p)}
//                                 >
//                                     Assign Rider
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}

//                     {parcels.length === 0 && (
//                         <tr>
//                             <td colSpan={6} className="text-center py-8">
//                                 No parcels waiting for rider
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default AssignRider;
import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  /* ── 1. fetch parcels needing rider ─────────────────────────── */
  const {
    data: parcels = [],
    isLoading: parcelsLoading,
  } = useQuery({
    queryKey: ['assign-parcels'],
    queryFn: async () => {
      const res = await axiosSecure.get(
        '/parcels?payment_status=paid&delivery_status=not%20collected'
      );
      return res.data;
    },
  });

  /* modal state */
  const [selectedParcel, setSelectedParcel] = useState(null);

  /* ── 2. fetch riders when modal open ────────────────────────── */
  const {
    data: riders = [],
    isLoading: ridersLoading,
  } = useQuery({
    queryKey: ['riders-by-district', selectedParcel?.senderServiceCenter],
    enabled: !!selectedParcel,
    queryFn: async () => {
      const district = selectedParcel.senderServiceCenter;
      const res = await axiosSecure.get(`/riders?district=${district}`);
      return res.data;
    },
  });

  /* chosen rider in radio list */
  const [chosenRiderId, setChosenRiderId] = useState(null);

  /* ── 3. assign rider mutation ───────────────────────────────── */
  const assignMutation = useMutation({
    mutationFn: ({ parcelId, riderId }) =>
      axiosSecure.patch(`/parcels/${parcelId}/assign-rider`, { riderId }),
    onSuccess: () => {
      Swal.fire('Success', 'Rider assigned!', 'success');
      setSelectedParcel(null); // close modal
      queryClient.invalidateQueries(['assign-parcels']);
    },
    onError: () => Swal.fire('Error', 'Failed to assign rider', 'error'),
  });

  /* ── 4. Helpers ─────────────────────────────────────────────── */
  const openModal = (parcel) => {
    setSelectedParcel(parcel);
    setChosenRiderId(null);
  };
  const closeModal = () => setSelectedParcel(null);

  /* ── 5. render ──────────────────────────────────────────────── */
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Parcels Awaiting Rider</h2>

      {parcelsLoading ? (
        <p className="text-center">Loading parcels…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Sender Region</th>
                <th>Service Center</th>
                <th>Cost (৳)</th>
                <th>Created At</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((p, idx) => (
                <tr key={p._id}>
                  <td>{idx + 1}</td>
                  <td>{p.trackingId}</td>
                  <td>{p.title}</td>
                  <td className="capitalize">{p.parcelType}</td>
                  <td>{p.senderRegion}</td>
                  <td>{p.senderServiceCenter}</td>
                  <td>{p.cost}</td>
                  <td>{new Date(p.creation_date).toLocaleString()}</td>
                  <td className="flex justify-end">
                    <button
                      className="btn btn-sm btn-primary text-black"
                      onClick={() => openModal(p)}
                    >
                      Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
              {parcels.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    No parcels to assign
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────── */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              Assign Rider for {selectedParcel.trackingId}
            </h3>

            {ridersLoading ? (
              <p>Loading riders…</p>
            ) : riders.length === 0 ? (
              <p className="text-error">No riders found in this district.</p>
            ) : (
              <div className="h-64 overflow-y-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riders.map((r) => (
                      <tr key={r._id}>
                        <td>
                          <input
                            type="radio"
                            name="rider"
                            className="radio radio-sm"
                            checked={chosenRiderId === r._id}
                            onChange={() => setChosenRiderId(r._id)}
                          />
                        </td>
                        <td>{r.name}</td>
                        <td>{r.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary text-black"
                disabled={!chosenRiderId || assignMutation.isLoading}
                onClick={() =>
                  assignMutation.mutate({
                    parcelId: selectedParcel._id,
                    riderId: chosenRiderId,
                  })
                }
              >
                {assignMutation.isLoading ? 'Assigning…' : 'Assign Rider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
