import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getColleges, createColleges, deleteColleges, updateColleges, getSingle } from "@/http/colleges";

/**
 * Hook for fetching colleges
 * @param {Object} params - Query parameters
 */
export const useColleges = (params = {}) => {
    return useQuery({
        queryKey: ["colleges", params],
        queryFn: async () => {
            const res = await getColleges(params);
            return res.data.data || res.data;
        },
    });
};

/**
 * Hook for fetching a single college
 * @param {string} id - College UUID
 */
export const useCollege = (id) => {
    return useQuery({
        queryKey: ["college", id],
        queryFn: async () => {
            const res = await getSingle(id);
            return res.data.data || res.data;
        },
        enabled: !!id,
    });
};

/**
 * Hook for creating a college
 */
export const useCreateCollege = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ formData, logo, images }) => createColleges(formData, logo, images),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["colleges"] });
        },
    });
};

/**
 * Hook for updating a college
 */
export const useUpdateCollege = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }) => updateColleges(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["colleges"] });
        },
    });
};

/**
 * Hook for deleting a college
 */
export const useDeleteCollege = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteColleges,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["colleges"] });
        },
    });
};
