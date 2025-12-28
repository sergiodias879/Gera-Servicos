import { trpc } from "@/lib/trpc";
import { useAuth } from "./use-auth";

export function useClients() {
  const { isAuthenticated } = useAuth();

  // List all clients
  const {
    data: clients = [],
    isLoading: isLoadingClients,
    error: clientsError,
    refetch: refetchClients,
  } = trpc.clients.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Create client mutation
  const createClientMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      refetchClients();
    },
  });

  // Update client mutation
  const updateClientMutation = trpc.clients.update.useMutation({
    onSuccess: () => {
      refetchClients();
    },
  });

  // Delete client mutation
  const deleteClientMutation = trpc.clients.delete.useMutation({
    onSuccess: () => {
      refetchClients();
    },
  });

  return {
    clients,
    isLoadingClients,
    clientsError,
    refetchClients,
    createClient: createClientMutation.mutateAsync,
    updateClient: updateClientMutation.mutateAsync,
    deleteClient: deleteClientMutation.mutateAsync,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
}
