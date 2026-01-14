import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTrainings, getTrainingById, createTraining, updateTraining, deleteTraining } from "@/http/training";

/**
 * Hook for fetching trainings
 * @param {Object} params - Query parameters (page, size, sortBy, sortDir)
 */
export const useTrainings = (params = {}) => {
    return useQuery({
        queryKey: ["trainings", params],
        queryFn: async () => {
            const res = await getTrainings(params);
            return res.data.data || res.data;
        },
    });
};

/**
 * Hook for fetching single training
 * @param {number} id - Training ID
 */
export const useTraining = (id) => {
    return useQuery({
        queryKey: ["training", id],
        queryFn: async () => {
            const res = await getTrainingById(id);
            return res.data.data || res.data;
        },
        enabled: !!id,
    });
};

/**
 * Hook for creating a training
 */
export const useCreateTraining = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTraining,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trainings"] });
        },
    });
};

/**
 * Hook for updating a training
 */
export const useUpdateTraining = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateTraining(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trainings"] });
        },
    });
};

/**
 * Hook for deleting a training
 */
export const useDeleteTraining = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTraining,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trainings"] });
        },
    });
};
