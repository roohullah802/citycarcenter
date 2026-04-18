import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesContextType {
  favouriteIds: string[];
  handleFav: (carId: string) => Promise<void>;
  isFavourite: (carId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);
const STORAGE_KEY = "@favourite_car_ids";

export const FavoritesProvider = ({ children }: any) => {
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setFavouriteIds(JSON.parse(data));
    });
  }, []);

  const handleFav = async (carId: any) => {
    const isFav = favouriteIds.includes(carId);
    const updatedList = isFav
      ? favouriteIds.filter((id) => id !== carId)
      : [...favouriteIds, carId];

    setFavouriteIds(updatedList);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  };

  const isFavourite = (carId: string) => favouriteIds.includes(carId);

  return (
    <FavoritesContext.Provider value={{ favouriteIds, handleFav, isFavourite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
