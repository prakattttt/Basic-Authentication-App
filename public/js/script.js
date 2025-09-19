const register = document.querySelector("#registerForm");
const login = document.querySelector("#loginForm");
const logout = document.querySelector("#logoutBtn");
const userDataBox = document.querySelector("#userData");

let popupContainer = document.createElement("div");
popupContainer.id = "popupContainer";
document.body.appendChild(popupContainer);

const popUp = (msg, type = "success") => {
  popupContainer.textContent = msg;
  
  popupContainer.className = "";
  popupContainer.classList.add("show", type);

  setTimeout(() => {
    popupContainer.classList.remove("show");
  }, 3000);
};

const JsonParser = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const registerUser = async () => {
  const username = document.querySelector("#regUsername").value.trim();
  const email = document.querySelector("#regEmail").value.trim();
  const password = document.querySelector("#regPassword").value;

  try {
    const response = await fetch("http://localhost:5000/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await JsonParser(response);
    popUp(data?.message || "Registration complete!", response.ok ? "success" : "error");
    register.reset();
  } catch {
    popUp("Something went wrong while registering!", "error");
  }
};

const loginUser = async () => {
  const username = document.querySelector("#username").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await JsonParser(response);

    if (!response.ok) {
      popUp(data?.message || "Login failed!", "error");
      return;
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("username", username);
    popUp(data.message, "success");
    login.reset();
    
    setTimeout(() => window.location.href = "/html/data.html", 1000);
  } catch {
    popUp("Something went wrong while logging in!", "error");
  }
};

const logoutUser = async () => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    popUp("Logged out successfully!", "success");

    setTimeout(() => window.location.href = "/html/index.html", 500);
  } catch {
    popUp("Something went wrong while logging out!", "error");
  }
};

const fetchUserData = async () => {
  if (!userDataBox) return;

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("accessToken");

  if (!username || !token) {
    userDataBox.textContent = "Please login first!";
    popUp("Please login first!", "error");
    setTimeout(() => window.location.href = "/html/index.html", 1500);
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/user/data/${username}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await JsonParser(response);

    if (!response.ok) {
      userDataBox.textContent = data?.message || "Could not fetch data!";
      popUp(data?.message || "Could not fetch data!", "error");
      return;
    }

    userDataBox.textContent = `Your secret:     ${data.secretMsg}`;
    popUp("Data loaded successfully!", "success");
  } catch {
    userDataBox.textContent = "Something went wrong while fetching data!";
    popUp("Something went wrong while fetching data!", "error");
  }
};

if (register) {
  register.addEventListener("submit", (e) => {
    e.preventDefault();
    registerUser();
  });
}

if (login) {
  login.addEventListener("submit", (e) => {
    e.preventDefault();
    loginUser();
  });
}

if (logout) {
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    logoutUser();
  });
}

document.addEventListener("DOMContentLoaded", fetchUserData);