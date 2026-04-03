import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.implementation';
import { toaster } from "@/shared/ui/toaster-config";
import { type CreateUserDto, type UpdateUserDto } from "@crm/shared/schemas/auth.schema.js";

/**
 * 1. GET ALL USERS
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });
};

/**
 * 2. GET SINGLE USER BY ID (Used for Edit Modal)
 */
export const useUser = (id: string | undefined) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  });
};

/**
 * 3. CREATE USER
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      
      toaster.create({ 
        title: "User created", 
        description: "New account has been added to the system",
        type: "success" 
      });
    },
    onError: (error: any) => {
      toaster.create({ 
        title: "Creation failed", 
        description: error.response?.data?.error || error.message,
        type: "error" 
      });
    }
  });
};

/**
 * 4. UPDATE USER
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => 
      userService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      
      toaster.create({ title: "User updated", type: "success" });
    },
    onError: (error: any) => {
      toaster.create({ 
        title: "Update failed", 
        description: error.response?.data?.error || error.message,
        type: "error" 
      });
    }
  });
};

/**
 * 5. DELETE USER
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      
      toaster.create({ title: "User deleted", type: "success" });
    },
    onError: (error: any) => {
      toaster.create({ 
        title: "Deletion failed", 
        description: error.response?.data?.error || error.message,
        type: "error" 
      });
    }
  });
};