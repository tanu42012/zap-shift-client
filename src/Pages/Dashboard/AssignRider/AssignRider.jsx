
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
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { FaMotorcycle } from "react-icons/fa";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { useState } from "react";
// import Swal from "sweetalert2";
// // import useTrackingLogger from "../../../hooks/useTrackingLogger";
// import useAuth from "../../../Hooks/useAuth";


// const AssignRider = () => {
//     const axiosSecure = useAxiosSecure();
//     const [selectedParcel, setSelectedParcel] = useState(null);
//     const [selectedRider, setSelectedRider] = useState(null);
//     const [riders, setRiders] = useState([]);
//     const [loadingRiders, setLoadingRiders] = useState(false);
//     const queryClient = useQueryClient();
//     // const { logTracking } = useTrackingLogger();
//     const { user } = useAuth();

//     const { data: parcels = [], isLoading } = useQuery({
//         queryKey: ["assignableParcels"],
//         queryFn: async () => {
//             const res = await axiosSecure.get(
//                 "/parcels?payment_status=paid&delivery_status=not_collected"
//             );
//             // Sort oldest first
//             return res.data.sort(
//                 (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
//             );
//         },
//     });

//     const { mutateAsync: assignRider } = useMutation({
//         mutationFn: async ({ parcelId, rider }) => {
//             setSelectedRider(rider);
//             const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
//                 riderId: rider._id,
//                 riderEmail: rider.email,
//                 riderName: rider.name,
//             });
//             return res.data;
//         },
//         onSuccess: async () => {
//             queryClient.invalidateQueries(["assignableParcels"]);
//             Swal.fire("Success", "Rider assigned successfully!", "success");

//             // track rider assigned
//             await logTracking({
//                 tracking_id: selectedParcel.tracking_id,
//                 status: "rider_assigned",
//                 details: `Assigned to ${selectedRider.name}`,
//                 updated_by: user.email,
//             });
//             document.getElementById("assignModal").close();
//         },
//         onError: () => {
//             Swal.fire("Error", "Failed to assign rider", "error");
//         },
//     });

//     // Step 2: Open modal and load matching riders
//     const openAssignModal = async (parcel) => {
//         setSelectedParcel(parcel);
//         setLoadingRiders(true);
//         setRiders([]);

//         try {
//             const res = await axiosSecure.get("/riders/available", {
//                 params: {
//                     district: parcel.sender_center, // match with rider.district
//                 },
//             });
//             setRiders(res.data);
//         } catch (error) {
//             console.error("Error fetching riders", error);
//             Swal.fire("Error", "Failed to load riders", "error");
//         } finally {
//             setLoadingRiders(false);
//             document.getElementById("assignModal").showModal();
//         }
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcels</h2>

//             {isLoading ? (
//                 <p>Loading parcels...</p>
//             ) : parcels.length === 0 ? (
//                 <p className="text-gray-500">No parcels available for assignment.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="table table-zebra w-full">
//                         <thead>
//                             <tr>
//                                 <th>Tracking ID</th>
//                                 <th>Title</th>
//                                 <th>Type</th>
//                                 <th>Sender Center</th>
//                                 <th>Receiver Center</th>
//                                 <th>Cost</th>
//                                 <th>Created At</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {parcels.map((parcel) => (
//                                 <tr key={parcel._id}>
//                                     <td>{parcel.tracking_id}</td>
//                                     <td>{parcel.title}</td>
//                                     <td>{parcel.type}</td>
//                                     <td>{parcel.sender_center}</td>
//                                     <td>{parcel.receiver_center}</td>
//                                     <td>৳{parcel.cost}</td>
//                                     <td>{new Date(parcel.creation_date).toLocaleDateString()}</td>
//                                     <td>
//                                         <button
//                                             onClick={() => openAssignModal(parcel)}
//                                             className="btn btn-sm btn-primary text-black">
//                                             <FaMotorcycle className="inline-block mr-1" />
//                                             Assign Rider
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {/* 🛵 Assign Rider Modal */}
//                     <dialog id="assignModal" className="modal">
//                         <div className="modal-box max-w-2xl">
//                             <h3 className="text-lg font-bold mb-3">
//                                 Assign Rider for Parcel:{" "}
//                                 <span className="text-primary">{selectedParcel?.title}</span>
//                             </h3>

//                             {loadingRiders ? (
//                                 <p>Loading riders...</p>
//                             ) : riders.length === 0 ? (
//                                 <p className="text-error">No available riders in this district.</p>
//                             ) : (
//                                 <div className="overflow-x-auto max-h-80 overflow-y-auto">
//                                     <table className="table table-sm">
//                                         <thead>
//                                             <tr>
//                                                 <th>Name</th>
//                                                 <th>Phone</th>
//                                                 <th>Bike Info</th>
//                                                 <th>Action</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {riders.map((rider) => (
//                                                 <tr key={rider._id}>
//                                                     <td>{rider.name}</td>
//                                                     <td>{rider.phone}</td>
//                                                     <td>
//                                                         {rider.bike_brand} - {rider.bike_registration}
//                                                     </td>
//                                                     <td>
//                                                         <button
//                                                             onClick={() =>
//                                                                 assignRider({
//                                                                     parcelId: selectedParcel._id,
//                                                                     rider,
//                                                                 })
//                                                             }
//                                                             className="btn btn-xs btn-success">
//                                                             Assign
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             )}

//                             <div className="modal-action">
//                                 <form method="dialog">
//                                     <button className="btn">Close</button>
//                                 </form>
//                             </div>
//                         </div>
//                     </dialog>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AssignRider;