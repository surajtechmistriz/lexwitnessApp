import api from "../axios";


export async function getEditorPick(params?: {
    category_id: number;
    limit?: number
}){
    const response = await api.get("/posts", {
        params: {
            category_id:5,
            limit:params?.limit ?? 5,
            latest:1,
        }
    })
    return response.data.data || []
}