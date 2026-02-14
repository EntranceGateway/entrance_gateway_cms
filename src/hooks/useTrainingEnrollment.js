import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  enrollInTraining,
  getTrainingEnrollments,
  getTrainingEnrollmentById,
  getMyTrainingEnrollments,
  getTrainingEnrollmentsByStatus,
  cancelTrainingEnrollment,
  cancelEnrollmentBySystem,
  updateEnrollmentProgress,
  approveTrainingEnrollment,
  rejectTrainingEnrollment,
} from "@/http/trainingEnrollment";

/**
 * Hook for fetching all training enrollments (Admin)
 */
export const useTrainingEnrollments = (params = {}) => {
  return useQuery({
    queryKey: ["trainingEnrollments", params],
    queryFn: async () => {
      const res = await getTrainingEnrollments(params);
      return res.data.data || res.data;
    },
  });
};

/**
 * Hook for fetching enrollment by ID
 */
export const useTrainingEnrollment = (id) => {
  return useQuery({
    queryKey: ["trainingEnrollment", id],
    queryFn: async () => {
      const res = await getTrainingEnrollmentById(id);
      return res.data.data || res.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook for fetching my enrollments
 */
export const useMyTrainingEnrollments = () => {
  return useQuery({
    queryKey: ["myTrainingEnrollments"],
    queryFn: async () => {
      const res = await getMyTrainingEnrollments();
      return res.data.data || res.data;
    },
  });
};

/**
 * Hook for fetching enrollments by status (Admin)
 */
export const useTrainingEnrollmentsByStatus = (status, params = {}) => {
  return useQuery({
    queryKey: ["trainingEnrollments", "status", status, params],
    queryFn: async () => {
      const res = await getTrainingEnrollmentsByStatus(status, params);
      return res.data.data || res.data;
    },
    enabled: !!status,
  });
};

/**
 * Hook for enrolling in training
 */
export const useEnrollInTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ trainingId, idempotencyKey }) => enrollInTraining(trainingId, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingEnrollments"] });
      queryClient.invalidateQueries({ queryKey: ["myTrainingEnrollments"] });
    },
  });
};

/**
 * Hook for canceling enrollment (User)
 */
export const useCancelTrainingEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelTrainingEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingEnrollments"] });
      queryClient.invalidateQueries({ queryKey: ["myTrainingEnrollments"] });
    },
  });
};

/**
 * Hook for canceling enrollment by system (Admin)
 */
export const useCancelEnrollmentBySystem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelEnrollmentBySystem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingEnrollments"] });
      queryClient.invalidateQueries({ queryKey: ["trainingEnrollment"] });
    },
  });
};

/**
 * Hook for updating enrollment progress (Admin)
 */
export const useUpdateEnrollmentProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, progressPercentage }) => updateEnrollmentProgress(id, progressPercentage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingEnrollments"] });
    },
  });
};

/**
 * Hook for approving enrollment (Admin)
 */
export const useApproveTrainingEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveTrainingEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingEnrollments"] });
      queryClient.invalidateQueries({ queryKey: ["trainingEnrollment"] });
    },
  });
};

/**
 * Hook for rejecting enrollment (Admin)
 */
export const useRejectTrainingEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, reason }) => rejectTrainingEnrollment(enrollmentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingEnrollments"] });
      queryClient.invalidateQueries({ queryKey: ["trainingEnrollment"] });
    },
  });
};
