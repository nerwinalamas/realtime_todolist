import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { v4 as uuidV4 } from "uuid";
import io from "socket.io-client";

const Todo = () => {
	const [newTodo, setNewTodo] = useState("");
	const [socket, setSocket] = useState(null);
	const [todos, setTodos] = useState([]);
	const [filteredTodos, setFilteredTodos] = useState([]);

	const handleCreateTodo = (e) => {
		e.preventDefault();

		if (!newTodo) return

		const todo = { id: uuidV4(), todo: newTodo, status: "pending" };
		try {
			if (socket) {
				socket.emit("newTodo", todo);
			}
			setNewTodo("");
		} catch (error) {
			console.log("Error on creating todo: ", error);
		}
	};

	const handleDelete = (id) => {
		if (socket) {
			socket.emit("deleteTodo", id);
			setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
		}
	};

	const handleStatusChange = (id, status) => {
        if (socket) {
            socket.emit("updateTodo", { id, status });
        }
    };

	const bgColor = (status) => { 
		switch (status) {
			case "pending":
				return "bg-gray-200"
			case "on-going":
				return "bg-orange-200"
			case "completed":
				return "bg-green-200"
			default:
				return "bg-gray-200";
		}
	}

	const filteredData = (status) => {
		const todosData = todos.filter((todo) => todo.status === status)
		setFilteredTodos(todosData);
	}

	const resetFilteredData = () => {
        setFilteredTodos(todos);
    }

	useEffect(() => {
		const newSocket = io("http://localhost:8000");
		setSocket(newSocket);

		return () => {
			if (newSocket) {
				newSocket.disconnect();
			}
		};
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on("todos", (todos) => {
				setTodos(todos);
				setFilteredTodos(todos);
			});
		}
	}, [socket]);

	return (
		<div className="w-80 p-5 rounded-md bg-customWhite text-customBlack md:min-h-[50vh] md:w-[50vw]">
			<form
				onSubmit={handleCreateTodo}
				className="h-14 flex justify-between items-center "
			>
				<input
					type="text"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					className="border-2 p-2 w-full rounded-md outline-none"
				/>
				<button
					type="submit"
					title="Send"
					className="w-14 h-full flex items-center justify-center bg-transparent border-none"
				>
					<Send className="w-11 h-11 p-3 rounded-md text-customWhite bg-blue-500" />
				</button>
			</form>
			<div className="text-sm mb-2 flex flex-wrap gap-3">
				<p onClick={resetFilteredData} className="px-2 py-1 rounded-sm bg-slate-200 cursor-pointer hover:bg-slate-300">all</p>
				<p onClick={() => filteredData("pending")} className="px-2 py-1 rounded-sm bg-slate-200 cursor-pointer hover:bg-slate-300">pending</p>
				<p onClick={() => filteredData("on-going")} className="px-2 py-1 rounded-sm bg-slate-200 cursor-pointer hover:bg-slate-300">on-going</p>
				<p onClick={() => filteredData("completed")} className="px-2 py-1 rounded-sm bg-slate-200 cursor-pointer hover:bg-slate-300">completed</p>
			</div>
			<ul className="h-[70vh] overflow-y-auto text-sm flex flex-col gap-2 md:h-[50vh] ">
				{filteredTodos && filteredTodos.length > 0 ? (
					filteredTodos.map((todo) => (
						<li
							key={todo.id}
							className={`p-2 flex items-center justify-between rounded-md ${bgColor(todo.status)}`}
						>
							<div className="w-80 flex flex-col gap-2">
								<p className="capitalize font-semibold">{todo.todo}</p>
								<form className="flex flex-col gap-2 lg:flex-row">
									<div className="flex gap-1">
										<input
											type="radio"
											name={`status_${todo.id}`}
											id={`pending_${todo.id}`}
											value="pending"
											checked={todo.status === "pending"}
											onChange={() =>
												handleStatusChange(
													todo.id,
													"pending"
												)
											}
										/>
										<label htmlFor={`pending_${todo.id}`} className="hover:cursor-pointer">
											Pending
										</label>
									</div>
									<div className="flex gap-1">
										<input
											type="radio"
											name={`status_${todo.id}`}
											id={`on-going_${todo.id}`}
											value="on-going"
											checked={todo.status === "on-going"}
											onChange={() =>
												handleStatusChange(
													todo.id,
													"on-going"
												)
											}
										/>
										<label htmlFor={`on-going_${todo.id}`} className="hover:cursor-pointer">
											On-Going
										</label>
									</div>
									<div className="flex gap-1">
										<input
											type="radio"
											name={`status_${todo.id}`}
											id={`completed_${todo.id}`}
											value="completed"
											checked={todo.status === "completed"}
											onChange={() =>
												handleStatusChange(
													todo.id,
													"completed"
												)
											}
										/>
										<label htmlFor={`completed_${todo.id}`} className="hover:cursor-pointer">
											Completed
										</label>
									</div>
								</form>
							</div>
							<p
								onClick={() => handleDelete(todo.id)}
								className="cursor-pointer py-2 px-5 rounded-md bg-red-600 text-customWhite"
							>
								delete
							</p>
						</li>
					))
				) : (
					<p>No Todo</p>
				)}
			</ul>
		</div>
	);
};

export default Todo;
