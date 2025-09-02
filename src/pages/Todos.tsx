import React, { useEffect, useState } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../services/todo-service";
import "../App.css";

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

const Todos: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState("");

    const fetchTodos = async () => {
        const res = await getTodos();
        setTodos(res.data);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleAdd = async () => {
        if (!title.trim()) return;
        await addTodo(title);
        setTitle("");
        fetchTodos();
    };

    const handleToggle = async (todo: Todo) => {
        await updateTodo(todo.id, { completed: !todo.completed });
        fetchTodos();
    };

    const handleComplete = async (todo: Todo) => {
        await updateTodo(todo.id, { completed: !todo.completed });
        fetchTodos();
    };


    const handleEdit = async (todo: Todo) => {
        const newTitle = prompt("Edit Todo", todo.title);
        if (newTitle) {
            await updateTodo(todo.id, { title: newTitle });
            fetchTodos();
        }
    };

    const handleDelete = async (id: number) => {
        await deleteTodo(id);
        fetchTodos();
    };

    return (
        <div className="app-container">
            <h2>To-Do App</h2>
            <div className="input-container">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new task"
                    className="todo-input"
                />
                <button onClick={handleAdd} className="btn btn-add">Add</button>
            </div>

            <ul className="todo-list">
                {todos.map((todo) => (
                    <li key={todo.id} className="todo-item">
                        <span
                            onClick={() => handleToggle(todo)}
                            className={`todo-text ${todo.completed ? "completed" : ""}`}
                        >
                            {todo.title}
                        </span>
                        <div className="btn-group">
                            <button
                                onClick={() => handleComplete(todo)}
                                className={`btn ${todo.completed ? "btn-undo" : "btn-complete"}`}
                            >
                                {todo.completed ? "Undo" : "Complete"}
                            </button>
                            <button onClick={() => handleEdit(todo)} className="btn btn-edit">Edit</button>
                            <button onClick={() => handleDelete(todo.id)} className="btn btn-delete">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Todos;
