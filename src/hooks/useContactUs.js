import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllContactMessages, getContactMessageById, deleteContactMessage } from "@/http/contactUs";
import toast from "react-hot-toast";

// Get all contact messages
export const useContactMessages = (params) => {
  return useQuery({
    queryKey: ["contactMessages", params],
    queryFn: () => getAllContactMessages(params),
    select: (response) => response?.data?.data || response?.data,
  });
};

// Get single contact message
export const useContactMessage = (id) => {
  return useQuery({
    queryKey: ["contactMessage", id],
    queryFn: () => getContactMessageById(id),
    select: (response) => response?.data?.data || response?.data,
    enabled: !!id,
  });
};

// Delete contact message
export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
      toast.success("Contact message deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete contact message");
    },
  });
};
