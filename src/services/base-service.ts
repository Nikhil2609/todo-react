import axios from "axios";
// import axiosRetry from "axios-retry";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    timeout: 25000
});

axiosInstance.interceptors.request.use(
    (request) => {
        // Pass Authntication token 
        // const token = localStorage.getItem("token");
        // if (token) { request.headers.Authorization = `Bearer ${token}`; }
        return request;
    },
    (error) => {
        // Request error handling
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful responses
        console.log("Response Received:", response);
        return response;
    },
    (error) => {
        // Handle error responses
        if (error.response?.status === 401) {
            window.location.href = "/login";
            localStorage.clear();
            return Promise.reject(error);
        }

        // Retry logic manually
        const config = error.config;
        if (!config.retryCount) config.retryCount = 0;
        if (config.retryCount < 3) {

            // check if user online/offline don't call api
            // display alert use is offline

            if (!navigator.onLine) {
                console.log("You are offline !");
                alert("You are offline !");
                return Promise.reject(error);
            }

            config.retryCount++; //   
            console.log(`Retrying request... attempt ${config.retryCount}`);
            setTimeout(() => {
                axiosInstance(config);
            }, config.retryCount * 1000);
        }

        return Promise.reject(error);
    }
);

// axios retry hit api 3 times when getting error from api response on 500 
// axiosRetry(axiosInstance, {
//   retries: 3, // number of retries
//   retryDelay: (retryCount) => retryCount * 1000, // wait time between retries
//   retryCondition: (error) => {
//     console.log("Error => ", error, error.response?.status);
//     return error.response?.status >= 500 || !error.response; // retry on 5xx or network errors
//   },
// });

// handle axios retry mechanism manually
//     let retry_count = 0;   
//     const fetchUsers = async () => {

//         try {
//             const response = await getUsers();
//             setusers(response.data);
//         } catch(err) {
//             console.log("err=>", err);
//             console.log("retry_count=>", retry_count);
//             if(retry_count < 3) {
//                 retry_count++; //   

//                 setTimeout(() => {
//                     fetchUsers();
//                 }, retry_count * 1000);
//             }
//         }
//   }


export default axiosInstance;