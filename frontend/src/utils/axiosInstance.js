// import axios from "axios";

// const axiosBase = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default axiosBase;

import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://evangadi-3rd-project-12.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosBase;
