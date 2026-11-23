import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("An error took place");
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { cities, isLoading, currentCity, error } = state;

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) throw new Error("An error took place");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        console.error(error.message);
        dispatch({
          type: "rejected",
          payload: "There was an error laoding the data..",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        if (!res.ok) throw new Error("An error took place");
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        console.error(error.message);
        dispatch({
          type: "rejected",
          payload: "There was an error laoding the city..",
        });
      }
    },
    [dispatch, currentCity.id],
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity), //cea ce vreau sa tirmit
        headers: {
          "Content-Type": "application/json", //ca sa stie server-ul in ce format este infromatia pe care o priemste
        },
      });
      if (!res.ok) throw new Error("An error took place");
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city..",
      });
      console.error(error.message);
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("An error took place");
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      console.error(error.message);
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city..",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
        currentCity: currentCity,
        getCity: getCity,
        createCity: createCity,
        deleteCity: deleteCity,
        error: error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) throw new Error("Error");

  return context;
}

export { CitiesProvider, useCities };
