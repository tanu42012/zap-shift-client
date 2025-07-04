// hooks/useUserRole.js
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';            // returns { user, loading }
import useAxiosSecure from './useAxiosSecure'; // axios instance with JWT header

/**
 * useUserRole
 * -----------------------------------------------------------------------------
 * Provides the signed‑in user’s role plus helper booleans.
 *
 * Returns:
 *   role          → 'admin' | 'rider' | 'user' | '' (not logged in)
 *   isAdmin       → boolean
 *   isRider       → boolean
 *   isUser        → boolean
 *   isLoading     → authLoading || roleLoading
 *   refetchRole() → manually refresh role from server
 *
 * Example:
 *   const { role, isAdmin, refetchRole } = useUserRole();
 */
const useUserRole=()=> {
  const { user, roleLoading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role='user' ,               // default '' when not logged in
    isLoading: roleLoading,
    refetch,                       // exposed for manual refresh
  } = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: !!user?.email && !authLoading,   // wait for user to load
    staleTime: 5 * 60 * 1000,                 // cache valid for 5 min
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role;         // default to 'user'
    },
  });

  return {
    role,
 roleLoading: authLoading || roleLoading,
    isAdmin: role === 'admin',
    isRider: role === 'rider',
    isUser:  role === 'user',
    refetchRole: refetch,                     // manual trigger if needed
  };
}
export default useUserRole;
