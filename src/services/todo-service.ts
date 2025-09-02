import axiosInstance from "./base-service"

// get user list api
export const getTodos = async () => {
    const todos = await axiosInstance.get('/todos');
    return todos;
}

export const addTodo = async (title: string) => {
    return await axiosInstance.post('/todos', { title });
}

export const updateTodo = async (id: number, data: any) => {
    return await axiosInstance.put(`/todos/${id}`, data);
}

export const deleteTodo = async (id: number) => {
    return await axiosInstance.delete(`/todos/${id}`);
}