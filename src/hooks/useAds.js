import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAds, createAd, deleteAd, updateAd } from "@/http/ads";
import toast from "react-hot-toast";

/**
 * Hook for fetching ads
 * @param {Object} params - Query parameters
 */
export const useAds = (params = {}) => {
    return useQuery({
        queryKey: ["ads", params],
        queryFn: () => getAds(params),
        select: (response) => response?.data?.data || response?.data,
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
            toast.success("Ad created successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create ad");
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
            toast.success("Ad updated successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update ad");
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
            toast.success("Ad deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete ad");
        },
    });
};
