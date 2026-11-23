import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const intialState = {
  user: null,
  isAuth: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuth: true };
    case "logout":
      return intialState;
    default:
      throw new Error("An error took place");
  }
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "VeryVeryVeryStrongPassword",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, intialState);

  const { user, isAuth } = state;

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({
        type: "login",
        payload: FAKE_USER,
      });
    else alert("Wrong email or password");
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user: FAKE_USER, isAuth, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) throw new Error("Used outside the provider");

  return context;
}

export { AuthProvider, useAuth };
