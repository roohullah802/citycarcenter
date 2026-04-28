import favouriteApi from "@/api/favourite.service";
import { useUser } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchFavourites = () => {
  const { user } = useUser();
  const userId = user?.id;

  return useQuery({
    queryKey: ["favourites", userId],
    queryFn: () => favouriteApi.getFavourites(userId!),
    enabled: !!userId,
  });
};

export const useToggleFavourite = () => {
  const { user } = useUser();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId: string) =>
      favouriteApi.toggleFavourite({ userId: userId!, carId }),
    onMutate: async (carId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["favourites", userId] });

      // Snapshot the previous value
      const previousFavourites = queryClient.getQueryData(["favourites", userId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["favourites", userId], (old: any) => {
        if (!old) return { success: true, carIds: [carId] };
        const isFav = old.carIds.includes(carId);
        const updatedIds = isFav
          ? old.carIds.filter((id: string) => id !== carId)
          : [...old.carIds, carId];
        return { ...old, carIds: updatedIds };
      });

      // Return a context object with the snapshotted value
      return { previousFavourites };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, carId, context: any) => {
      queryClient.setQueryData(
        ["favourites", userId],
        context.previousFavourites,
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites", userId] });
    },
  });
};
