import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAds, createAd, deleteAd, updateAd } from "@/http/ads";

/**
 * Hook for fetching ads
 * @param {Object} params - Query parameters
 */
export const useAds = (params = {}) => {
    return useQuery({
        queryKey: ["ads", params],
        queryFn: () => getAds(params),
    });
};

/**
 * Hook for creating an ad
 */
export const useCreateAd = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAd,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ads"] });
        },
    });
};

/**
 * Hook for updating an ad
 */
export const useUpdateAd = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateAd(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ads"] });
        },
    });
};

/**
 * Hook for deleting an ad
 */
export const useDeleteAd = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAd,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ads"] });
        },
    });
};
