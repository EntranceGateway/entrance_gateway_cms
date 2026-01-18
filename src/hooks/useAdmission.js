import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyForAdmission,
  getAdmissions,
  getAdmissionById,
  getMyAdmissions,
  getAdmissionsByStatus,
  updateAdmissionStatus,
  withdrawAdmission,
} from "@/http/admission";

/**
 * Hook for fetching all admissions (Admin)
 */
export const useAdmissions = (params = {}) => {
  return useQuery({
    queryKey: ["admissions", params],
    queryFn: async () => {
      const res = await getAdmissions(params);
      return res.data.data || res.data;
    },
  });
};

/**
 * Hook for fetching admission by ID
 */
export const useAdmission = (id) => {
  return useQuery({
    queryKey: ["admission", id],
    queryFn: async () => {
      const res = await getAdmissionById(id);
      return res.data.data || res.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook for fetching my admissions
 */
export const useMyAdmissions = () => {
  return useQuery({
    queryKey: ["myAdmissions"],
    queryFn: async () => {
      const res = await getMyAdmissions();
      return res.data.data || res.data;
    },
  });
};

/**
 * Hook for fetching admissions by status (Admin)
 */
export const useAdmissionsByStatus = (status, params = {}) => {
  return useQuery({
    queryKey: ["admissions", "status", status, params],
    queryFn: async () => {
      const res = await getAdmissionsByStatus(status, params);
      return res.data.data || res.data;
    },
    enabled: !!status,
  });
};

/**
 * Hook for applying for admission
 */
export const useApplyForAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyForAdmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      queryClient.invalidateQueries({ queryKey: ["myAdmissions"] });
    },
  });
};

/**
 * Hook for updating admission status (Admin)
 */
export const useUpdateAdmissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, remarks }) => updateAdmissionStatus(id, status, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
  });
};

/**
 * Hook for withdrawing admission
 */
export const useWithdrawAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawAdmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      queryClient.invalidateQueries({ queryKey: ["myAdmissions"] });
    },
  });
};
