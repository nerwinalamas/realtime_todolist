export const createTodo = (todo) => {
    return {
        type: "CREATE_TODO",
        payload: todo
    }
}

export const updateTodo = (todo) => {
    return {
        type: "UPDATE_TODO",
        payload: todo
    }
}

export const deleteTodo = (id) => {
    return {
        type: "DELETE_TODO",
        payload: id
    }
}