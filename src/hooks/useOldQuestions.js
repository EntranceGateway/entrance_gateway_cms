import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOldQuestions, filterOldQuestions, addOldQuestion, deleteOldQuestion, updateOldQuestion } from "@/http/oldQuestionCollection";

/**
 * Hook for fetching old questions (switches between list and filter endpoints)
 * @param {Object} params - Query parameters
 */
export const useOldQuestions = (params = {}) => {
    const { courseId } = params;
    const isFiltered = !!courseId;

    return useQuery({
        queryKey: ["oldQuestions", params],
        queryFn: async () => {
            const res = isFiltered ? await filterOldQuestions(params) : await getOldQuestions(params);
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
