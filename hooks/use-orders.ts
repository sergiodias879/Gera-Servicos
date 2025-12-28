import { trpc } from "@/lib/trpc";
import { useAuth } from "./use-auth";

export function useOrders() {
  const { isAuthenticated } = useAuth();

  // List all orders
  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders,
  } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Create order mutation
  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: () => {
      refetchOrders();
    },
  });

  // Update order mutation
  const updateOrderMutation = trpc.orders.update.useMutation({
    onSuccess: () => {
      refetchOrders();
    },
  });

  // Delete order mutation
  const deleteOrderMutation = trpc.orders.delete.useMutation({
    onSuccess: () => {
      refetchOrders();
    },
  });

  return {
    orders,
    isLoadingOrders,
    ordersError,
    refetchOrders,
    createOrder: createOrderMutation.mutateAsync,
    updateOrder: updateOrderMutation.mutateAsync,
    deleteOrder: deleteOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
  };
}
