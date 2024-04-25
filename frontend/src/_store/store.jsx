import { configureStore } from "@reduxjs/toolkit"
import todoReducer from "../_reducers/todoReducer"

const store = configureStore({
    reducer: todoReducer
})

export default store;