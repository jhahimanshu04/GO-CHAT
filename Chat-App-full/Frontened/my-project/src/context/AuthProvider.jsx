// /* eslint-disable react-refresh/only-export-components */
// import React, { createContext, useState, useContext, useEffect } from "react";

// import Cookies from "js-cookie";
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authUser, setAuthUser] = useState(null);
//    const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("ChatAppUser");
//     //  const cookieToken = Cookies.get("jwt");
//      if (storedUser) {
//        setAuthUser(JSON.parse(storedUser));
//     //  } 
//      }else{
//        setAuthUser(null);
//         localStorage.removeItem("ChatAppUser");
//      }

//     setLoading(false);
//   }, []);

//   return (
//     <AuthContext.Provider value={[authUser, setAuthUser,loading]}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("ChatAppUser");
    const cookieToken = Cookies.get("jwt"); // ✅ cookie bhi check karo

    if (storedUser && cookieToken) { // ✅ dono hone chahiye
      setAuthUser(JSON.parse(storedUser));
    } else {
      setAuthUser(null);
      localStorage.removeItem("ChatAppUser"); // ✅ cleanup
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser, loading]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);