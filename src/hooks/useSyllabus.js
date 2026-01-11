import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getSyllabus, 
  getSyllabusByAffiliationAndCourse, 
  getSyllabusByAffiliationCourseAndSemester,
  deleteSyllabus,
  addSyllabus,
  updateSyllabus
} from "@/http/syllabus";

/**
 * Hook for fetching syllabus data with smart filtering
 * Automatically switches endpoints based on provided filters
 */
export const useSyllabus = (params = {}) => {
  return useQuery({
    queryKey: ["syllabus", params],
    queryFn: async () => {
      // Destructure filters
      const { affiliation, courseName, semester, ...restParams } = params;

      const trimmedAffiliation = affiliation?.trim();
      const trimmedCourseName = courseName?.trim();
      const trimmedSemester = semester; 

      let res;

      // 1. All filters present
      if (trimmedAffiliation && trimmedCourseName && trimmedSemester) {
        res = await getSyllabusByAffiliationCourseAndSemester({
          affiliation: trimmedAffiliation,
          courseName: trimmedCourseName,
          semester: parseInt(trimmedSemester),
          ...restParams
        });
      }
      // 2. Affiliation + Course present
      else if (trimmedAffiliation && trimmedCourseName) {
        res = await getSyllabusByAffiliationAndCourse({
           affiliation: trimmedAffiliation,
           courseName: trimmedCourseName,
           ...restParams
        });
      }
      // 3. Default: Fetch all
      else {
        res = await getSyllabus(params);
      }

      // Backend returns structure usually like: { message, data: { content, ... } }
      // So we return raw response's data property which is usually the paginated object or the wrapper
      // Based on previous logs: res.data.data holds the content object
      return res?.data?.data || res?.data || {};
    },
    keepPreviousData: true,
  });
};

/**
 * Hook for creating syllabus
 */
export const useAddSyllabus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addSyllabus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["syllabus"] });
        },
    });
};

/**
* Hook for updating syllabus
*/
export const useUpdateSyllabus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateSyllabus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["syllabus"] });
        },
    });
};

/**
 * Hook for deleting syllabus
 */
export const useDeleteSyllabus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSyllabus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["syllabus"] });
        },
    });
};
