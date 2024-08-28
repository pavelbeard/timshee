import axios from "axios";
import {API_URL, CSRF_TOKEN} from "../../config";

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: { "Content-Type": "application/json" },
});