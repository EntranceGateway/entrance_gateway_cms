import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotices, createNotice, deleteNotice, updateNotice } from "@/http/notice";

/**
 * Hook for fetching notices
 * @param {Object} params - Query parameters
 */
export const useNotices = (params = {}) => {
    return useQuery({
        queryKey: ["notices", params],
        queryFn: async () => {
            const res = await getNotices(params);
            return res.data.data || res.data;
        },
    });
};

/**
 * Hook for creating a notice
 */
export const useCreateNotice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createNotice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notices"] });
        },
    });
};

/**
 * Hook for updating a notice
 */
export const useUpdateNotice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }) => updateNotice(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notices"] });
        },
    });
};

/**
 * Hook for deleting a notice
 */
export const useDeleteNotice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteNotice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notices"] });
        },
    });
};
