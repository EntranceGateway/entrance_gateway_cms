import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotes, createNote, deleteNote, updateNoteDetails as updateNote } from "@/http/notes";

/**
 * Hook for fetching notes
 * @param {Object} params - Query parameters (page, size, etc.)
 */
export const useNotes = (params = {}) => {
    return useQuery({
        queryKey: ["notes", params],
        queryFn: () => getNotes(params),
    });
};

/**
 * Hook for creating a note
 */
export const useCreateNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
};

/**
 * Hook for updating a note
 */
export const useUpdateNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateNote(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
};

/**
 * Hook for deleting a note
 */
export const useDeleteNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
};
