import api from "../axios"

export const getYears = async()=>{
    const response =  await api.get("/years")
    console.log("Year Data",response)
    return response.data
}