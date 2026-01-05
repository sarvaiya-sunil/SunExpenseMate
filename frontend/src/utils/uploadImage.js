import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  // Append Image file to form data
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // see header for file upload
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploadinf the image", error);
    throw error; // throw error for handling
  }
};

export default uploadImage;
