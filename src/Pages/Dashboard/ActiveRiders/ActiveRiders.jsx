import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: riders = [], refetch, isLoading } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/approved");
      return res.data;
    },
  });

  const handleDeactivate = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will deactivate the rider.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, deactivate",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/riders/${id}`, { status: "reject" });
          if (res.data.modifiedCount > 0) {
            Swal.fire("Done!", "Rider has been deactivated.", "success");
            refetch();
          }
        } catch (err) {
          Swal.fire("Error", "Something went wrong.", "error");
        }
      }
    });
  };

  const filteredRiders = riders.filter((rider) =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Active Riders</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="input input-bordered w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredRiders.length === 0 ? (
        <p>No active riders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Region</th>
                <th className="p-3 text-left">Applied At</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider, index) => (
                <tr key={rider._id} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{rider.name}</td>
                  <td className="p-3">{rider.email}</td>
                  <td className="p-3">{rider.phone}</td>
                  <td className="p-3">{rider.region}</td>
                  <td className="p-3">{new Date(rider.appliedAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleDeactivate(rider._id)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
