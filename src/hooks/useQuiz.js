import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import quizApi from "@/quiz/services/quizApi";

// --- Categories ---
export const useQuizCategories = (params = {}) => {
    return useQuery({
        queryKey: ["quizCategories", params],
        queryFn: async () => {
            const res = await quizApi.getCategories(params);
            return res.data.data || res.data;
        },
    });
};

export const useCreateQuizCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: quizApi.createCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizCategories"] }),
    });
};

export const useUpdateQuizCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => quizApi.updateCategory(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizCategories"] }),
    });
};

export const useDeleteQuizCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: quizApi.deleteCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizCategories"] }),
    });
};

// --- Courses ---
export const useQuizCourses = (params = {}) => {
    return useQuery({
        queryKey: ["quizCourses", params],
        queryFn: async () => {
            const res = await quizApi.getCourses(params);
            return res.data.data || res.data;
        },
    });
};

export const useQuizCoursesByCategory = (categoryId, params = {}) => {
    return useQuery({
        queryKey: ["quizCourses", categoryId, params],
        queryFn: async () => {
            const res = await quizApi.getCoursesByCategory(categoryId, params);
            return res.data.data || res.data;
        },
        enabled: !!categoryId,
    });
};

// --- Question Sets ---
export const useQuizQuestionSets = (params = {}) => {
    return useQuery({
        queryKey: ["quizQuestionSets", params],
        queryFn: async () => {
            const res = await quizApi.getQuestionSets(params);
            return res.data.data || res.data;
        },
    });
};

export const useDeleteQuizQuestionSet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: quizApi.deleteQuestionSet,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizQuestionSets"] }),
    });
};

export const useCreateQuizQuestionSet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: quizApi.createQuestionSet,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizQuestionSets"] }),
    });
};

export const useUpdateQuizQuestionSet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => quizApi.updateQuestionSet(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizQuestionSets"] }),
    });
};

// --- Questions ---
export const useQuizQuestions = (params = {}) => {
    return useQuery({
        queryKey: ["quizQuestions", params],
        queryFn: async () => {
            const res = await quizApi.getQuestions(params);
            return res.data.data || res.data;
        },
    });
};

export const useQuizQuestionsBySet = (setId, params = {}) => {
    return useQuery({
        queryKey: ["quizQuestions", setId, params],
        queryFn: async () => {
            const res = await quizApi.getQuestionsByQuestionSet(setId, params);
            return res.data.data || res.data;
        },
        enabled: !!setId,
    });
};

export const useDeleteQuizQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: quizApi.deleteQuestion,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizQuestions"] }),
    });
};

export const useCreateQuizQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: quizApi.createQuestion,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizQuestions"] }),
    });
};

export const useUpdateQuizQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => quizApi.updateQuestion(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizQuestions"] }),
    });
};

// --- Results ---
export const useQuizResults = (params = {}) => {
    return useQuery({
        queryKey: ["quizResults", params],
        queryFn: async () => {
            const res = await quizApi.getQuizResults(params);
            return res.data.data || res.data;
        },
    });
};

export const useQuizResult = (id) => {
    return useQuery({
        queryKey: ["quizResult", id],
        queryFn: async () => {
            const res = await quizApi.getQuizResultById(id);
            return res.data.data || res.data;
        },
        enabled: !!id,
    });
};

// --- Dashboard Stats ---
export const useQuizStats = () => {
    return useQuery({
        queryKey: ["quizStats"],
        queryFn: async () => {
            const [coursesRes, categoriesRes, questionSetsRes, resultsRes] = await Promise.all([
                quizApi.getCourses({ page: 0, size: 1 }).catch(() => ({ data: { data: { totalElements: 0 } } })),
                quizApi.getCategories({ page: 0, size: 1 }).catch(() => ({ data: { data: { totalElements: 0 } } })),
                quizApi.getQuestionSets({ page: 0, size: 1 }).catch(() => ({ data: { data: { totalElements: 0 } } })),
                quizApi.getQuizResults({ page: 0, size: 1 }).catch(() => ({ data: { totalElements: 0 } })),
            ]);

            return {
                courses: coursesRes.data.data?.totalElements || 0,
                categories: categoriesRes.data.data?.totalElements || 0,
                questionSets: questionSetsRes.data.data?.totalElements || 0,
                results: resultsRes.data.totalElements || 0,
            };
        },
        refetchInterval: 30000,
    });
};
