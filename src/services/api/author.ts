import api from "../axios"

export const getAuthor = async()=>{
    const response = await api.get("/authors")
    // console.log(response)
    return response.data
}