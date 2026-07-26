import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL: API_BASE });

export async function uploadResume(file, onProgress) {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await api.post("/resumes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (onProgress) onProgress(Math.round((evt.loaded * 100) / evt.total));
    },
  });
  return data;
}

export async function compareWithJob(resumeId, jobDescription) {
  const { data } = await api.post(`/resumes/${resumeId}/compare`, { jobDescription });
  return data;
}

export async function getResume(id) {
  const { data } = await api.get(`/resumes/${id}`);
  return data;
}
