import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogs, createBlog, deleteBlog, updateBlog } from "@/http/blog";

/**
 * Hook for fetching blogs
 * @param {Object} params - Query parameters (page, size, sortBy, sortDir)
 */
export const useBlogs = (params = {}) => {
    return useQuery({
        queryKey: ["blogs", params],
        queryFn: async () => {
            const res = await getBlogs(params);
            return res.data.data || res.data;
        },
    });
};

/**
 * Hook for creating a blog
 */
export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
};

/**
 * Hook for updating a blog
 */
export const useUpdateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }) => updateBlog(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
};

/**
 * Hook for deleting a blog
 */
export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
};
