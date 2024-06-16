export const getBackendUrl = () => {
    const url = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`;
    return url;
}