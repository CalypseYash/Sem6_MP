import axios from "axios";

function config() {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user && user.token}`,
    },
  };
}

export const uploadImage = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.cloudinary.com/v1_1/dhyyf1dnu/image/upload",
      data,
    });

    return {
      success: true,
      photoUrl: response.data.url,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getUsers = async (keyword) => {
  try {
    const response = await axios.get(`/api/users?search=${keyword}`, config());
    return response.data.users;
  } catch (error) {
    console.log(error.response);
  }
};
