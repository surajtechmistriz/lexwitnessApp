import api from "../../services/axios"

export const getEditorial = async()=>{
    const response = await api.get('/editorial-settings')
    return response.data
}