import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourses, getCoursesByAffiliation, deleteCourse, createCourse, updateCourse, getSingleCourse } from "@/http/course";

/**
 * Hook for fetching courses (switches between list and affiliation-specific endpoints)
 * @param {Object} params - Query parameters
 */
export const useCourses = (params = {}) => {
    const { affiliation } = params;
    const isAffiliationFiltered = !!affiliation;

    return useQuery({
        queryKey: ["courses", params],
        queryFn: async () => {
            const res = isAffiliationFiltered
                ? await getCoursesByAffiliation(params)
                : await getCourses(params);
            return res.data.data || res.data;
        },
    });
};

/**
 * Hook for fetching a single course
 * @param {string} id - Course ID
 */
export const useCourse = (id) => {
    return useQuery({
        queryKey: ["course", id],
        queryFn: async () => {
            const res = await getSingleCourse(id);
            return res.data.data || res.data;
        },
        enabled: !!id,
    });
};

/**
 * Hook for creating a course
 */
export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
};

/**
 * Hook for updating a course
 */
export const useUpdateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }) => updateCourse(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
};

/**
 * Hook for deleting a course
 */
export const useDeleteCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
};
