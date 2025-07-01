
import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();

  const [selectedRider, setSelectedRider] = useState(null);

  const {
    isLoading,
    data: riders = [],
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const confirmAction = (id, status) => {
    const isApprove = status === "approved";
    Swal.fire({
      title: isApprove ? "Approve this rider?" : "Reject this rider?",
      text: `You are about to ${isApprove ? "approve" : "reject"} this application.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: isApprove ? "Yes, approve" : "Yes, reject",
    }).then((result) => {
      if (result.isConfirmed) {
        handleAction(id, status);
      }
    });
  };

  const handleAction = async (id, status) => {
    try {
      const res = await axiosSecure.patch(`/riders/${id}`, { status });
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", `Rider has been ${status}`, "success");
        refetch();
        setSelectedRider(null);
      }
    } catch (error) {
      console.error("Failed to update rider status", error);
      Swal.fire("Error", "Could not update rider", "error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Pending Riders</h2>

      {riders.length === 0 ? (
        <p>No pending applications.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Region</th>
                <th className="p-3 text-left">Applied At</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, index) => (
                <tr key={rider._id} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{rider.name}</td>
                  <td className="p-3">{rider.email}</td>
                  <td className="p-3">{rider.region}</td>
                  <td className="p-3">
                    {new Date(rider.appliedAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedRider(rider)}
                      className="btn btn-sm btn-outline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md max-w-lg w-full shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Rider Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div className="font-medium">Name:</div>
              <div>{selectedRider.name}</div>
              <div className="font-medium">Email:</div>
              <div>{selectedRider.email}</div>
              <div className="font-medium">Phone:</div>
              <div>{selectedRider.phone}</div>
              <div className="font-medium">Age:</div>
              <div>{selectedRider.age}</div>
              <div className="font-medium">Region:</div>
              <div>{selectedRider.region}</div>
              <div className="font-medium">District:</div>
              <div>{selectedRider.district}</div>
              <div className="font-medium">Bike Brand:</div>
              <div>{selectedRider.bikeBrand}</div>
              <div className="font-medium">Bike Reg.:</div>
              <div>{selectedRider.bikeRegistration}</div>
              <div className="font-medium">Applied At:</div>
              <div>{new Date(selectedRider.appliedAt).toLocaleString()}</div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="btn btn-sm btn-error"
                onClick={() => confirmAction(selectedRider._id, "rejected")}
              >
                Reject
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={() => confirmAction(selectedRider._id, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-sm"
                onClick={() => setSelectedRider(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;

