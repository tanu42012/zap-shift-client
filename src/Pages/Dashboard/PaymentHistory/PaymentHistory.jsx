import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
const formateDate = (iso) => new Date(iso).toLocaleString();

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { isPending, data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        }
    })
    if (isPending) {
        return '...loading'
    }
    return (
        <div className="p-4 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
            <table className="min-w-full bg-white border border-gray-200 shadow">
                <thead className="bg-gray-100 text-left text-sm text-gray-600">
                    <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">User Email</th>
                        <th className="p-3">Transaction ID</th>
                        <th className="p-3">Parcel ID</th>
                       
                        <th className="p-3">Amount</th>
                        <th className="p-3">Date</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                    {payments.map((payment, index) => (
                        <tr key={payment._id} className="border-t">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{payment.userEmail}</td>
                            <td className="p-3">{payment.transactionId}</td>
                            <td className="p-3">{payment.parcelId}</td>
                            <td className="p-3">${(payment.amount ).toFixed(2)}</td>
                            <td className="p-3">
                                {new Date(payment.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentHistory;