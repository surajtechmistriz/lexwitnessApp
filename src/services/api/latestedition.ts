import api from "../axios"

 export const latesteEdition = async() => {
    const response = await api.get("/homepage-latest-edition")
    return response.data
 }