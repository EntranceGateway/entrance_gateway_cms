import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOldQuestions, filterOldQuestions, addOldQuestion, deleteOldQuestion, updateOldQuestion } from "@/http/oldQuestionCollection";

/**
 * Hook for fetching old questions (switches between list and filter endpoints)
 * @param {Object} params - Query parameters
 * 
 * Endpoints:
 * - Default list: GET /api/v1/old-question-collections?page=0&size=10&sortBy=year&sortDir=desc
 * - Filtered (with courseId): GET /api/v1/old-question-collections/filter
 */
export const useOldQuestions = (params = {}) => {
    const { courseId } = params;
    const isFiltered = !!courseId;

    return useQuery({
        queryKey: ["oldQuestions", params],
        queryFn: async () => {
            const res = isFiltered ? await filterOldQuestions(params) : await getAllOldQuestions(params);
            return res.data.data || res.data;
        },
    });
};

/**
 * Hook for adding an old question
 */
export const useAddOldQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addOldQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["oldQuestions"] });
        },
    });
};

/**
 * Hook for updating an old question
 */
export const useUpdateOldQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }) => updateOldQuestion(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["oldQuestions"] });
        },
    });
};

/**
 * Hook for deleting an old question
 */
export const useDeleteOldQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteOldQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["oldQuestions"] });
        },
    });
};
