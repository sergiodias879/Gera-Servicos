import { trpc } from "@/lib/trpc";
import { useAuth } from "./use-auth";

export function useSchedules() {
  const { isAuthenticated } = useAuth();

  // List all schedules
  const {
    data: schedules = [],
    isLoading: isLoadingSchedules,
    error: schedulesError,
    refetch: refetchSchedules,
  } = trpc.schedules.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Create schedule mutation
  const createScheduleMutation = trpc.schedules.create.useMutation({
    onSuccess: () => {
      refetchSchedules();
    },
  });

  // Update schedule mutation
  const updateScheduleMutation = trpc.schedules.update.useMutation({
    onSuccess: () => {
      refetchSchedules();
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = trpc.schedules.delete.useMutation({
    onSuccess: () => {
      refetchSchedules();
    },
  });

  return {
    schedules,
    isLoadingSchedules,
    schedulesError,
    refetchSchedules,
    createSchedule: createScheduleMutation.mutateAsync,
    updateSchedule: updateScheduleMutation.mutateAsync,
    deleteSchedule: deleteScheduleMutation.mutateAsync,
    isCreating: createScheduleMutation.isPending,
    isUpdating: updateScheduleMutation.isPending,
    isDeleting: deleteScheduleMutation.isPending,
  };
}
