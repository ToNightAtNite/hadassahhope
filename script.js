const ADMIN_PASSWORD = "Hf1234567890.";

const defaultPosts = [
  {
    id: 1,
    title: "School Children Smile Initiative",
    location: "Keffi Community School",
    caption: "Distributing exercise books and educational materials to young learners.",
    img: "https://images.pexels.com/photos/30037382/pexels-photo-30037382.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 2,
    title: "Community Feeding & Care",
    location: "Keffi Grassroots Outreach",
    caption: "Sharing warm meals and welfare packs with children and families.",
    img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Youth & Girl-Child Empowerment",
    location: "Keffi Secondary School Visit",
    caption: "Providing sanitary pads, toiletries, and mentorship sessions.",
    img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Back-to-School Uniform Drive",
    location: "Community Learning Center",
    caption: "Supporting students with uniforms and classroom essentials.",
    img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=600&q=80"
  }
];

let galleryPosts = JSON.parse(localStorage.getItem("hhf_posts")) || defaultPosts;
let isAdminLoggedIn = false;

function navigate(page) {
  ["home", "about", "outreach", "contact"].forEach((id) => {
    document.getElementById(`view-${id}`).classList.add("hidden");
    const navBtn = document.getElementById(`nav-${id}`);
    if (navBtn) navBtn.classList.remove("active-tab");
  });

  document.getElementById(`view-${page}`).classList.remove("hidden");
  const activeBtn = document.getElementById(`nav-${page}`);
  if (activeBtn) activeBtn.classList.add("active-tab");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMobileMenu() {
  document.getElementById("mobile-menu").classList.toggle("hidden");
}

function renderGalleries() {
  const homeGrid = document.getElementById("home-gallery-preview");
  const outreachGrid = document.getElementById("outreach-gallery-grid");

  homeGrid.innerHTML = galleryPosts.slice(0, 4).map((post) => `
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-purple-100 group">
      <img src="${post.img}" alt="${post.title}" class="w-full h-36 object-cover group-hover:scale-105 transition duration-500" />
      <div class="p-3">
        <p class="font-heading font-bold text-xs text-brandBlue truncate">${post.title}</p>
        <p class="text-[11px] text-brandPurple font-semibold">${post.location}</p>
      </div>
    </div>
  `).join("");

  outreachGrid.innerHTML = galleryPosts.map((post) => `
    <div class="bg-white rounded-2xl overflow-hidden shadow-md border border-purple-100 flex flex-col justify-between group">
      <div>
        <div class="relative overflow-hidden">
          <img src="${post.img}" alt="${post.title}" class="w-full h-44 object-cover group-hover:scale-105 transition duration-500" />
          <span class="absolute top-2.5 left-2.5 bg-brandBlue/90 text-white text-[10px] font-heading font-bold px-2.5 py-1 rounded-full">
            ${post.location}
          </span>
        </div>
        <div class="p-4">
          <h3 class="font-heading font-bold text-sm text-brandBlue mb-1">${post.title}</h3>
          <p class="text-xs text-slate-600 leading-relaxed">${post.caption || ""}</p>
        </div>
      </div>
      ${isAdminLoggedIn ? `
        <div class="px-4 pb-3">
          <button onclick="deletePost(${post.id})" class="text-[11px] text-red-600 font-bold hover:underline">🗑️ Remove Photo</button>
        </div>
      ` : ""}
    </div>
  `).join("");
}

function openAdminModal() {
  document.getElementById("admin-modal").classList.remove("hidden");
}

function closeAdminModal() {
  document.getElementById("admin-modal").classList.add("hidden");
}

function verifyAdmin(e) {
  e.preventDefault();
  const input = document.getElementById("admin-pass-input").value;
  if (input === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    document.getElementById("admin-login-box").classList.add("hidden");
    document.getElementById("admin-dashboard-box").classList.remove("hidden");
    document.getElementById("admin-error").classList.add("hidden");
    renderGalleries();
  } else {
    document.getElementById("admin-error").classList.remove("hidden");
  }
}

function adminAddPost(e) {
  e.preventDefault();
  const fileInput = document.getElementById("post-image-file");
  const title = document.getElementById("post-title").value;
  const location = document.getElementById("post-location").value;
  const caption = document.getElementById("post-caption").value;

  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const maxWidth = 700;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);

      const newPost = {
        id: Date.now(),
        title,
        location,
        caption,
        img: compressedDataUrl
      };

      galleryPosts.unshift(newPost);
      localStorage.setItem("hhf_posts", JSON.stringify(galleryPosts));
      renderGalleries();
      e.target.reset();
      closeAdminModal();
      navigate("outreach");
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function deletePost(id) {
  galleryPosts = galleryPosts.filter((p) => p.id !== id);
  localStorage.setItem("hhf_posts", JSON.stringify(galleryPosts));
  renderGalleries();
}

function resetDefaultPosts() {
  galleryPosts = [...defaultPosts];
  localStorage.setItem("hhf_posts", JSON.stringify(galleryPosts));
  renderGalleries();
}

function loadBankDetails() {
  const savedBank = localStorage.getItem("hhf_bank_name");
  const savedAcct = localStorage.getItem("hhf_acct_num");
  if (savedBank) document.getElementById("display-bank-name").innerText = savedBank;
  if (savedAcct) document.getElementById("display-acct-num").innerText = savedAcct;
}

function saveBankDetails() {
  const bank = document.getElementById("admin-bank-name").value.trim();
  const acct = document.getElementById("admin-acct-num").value.trim();
  if (bank) {
    localStorage.setItem("hhf_bank_name", bank);
    document.getElementById("display-bank-name").innerText = bank;
  }
  if (acct) {
    localStorage.setItem("hhf_acct_num", acct);
    document.getElementById("display-acct-num").innerText = acct;
  }
  alert("Bank details updated on Contact & Donate page!");
}

function copyAccount() {
  const acct = document.getElementById("display-acct-num").innerText.trim();
  navigator.clipboard.writeText(acct);
  const msg = document.getElementById("copy-msg");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 3000);
}

function sendInquiry(e) {
  e.preventDefault();
  const name = document.getElementById("contact-name").value;
  const phone = document.getElementById("contact-phone").value;
  const subject = document.getElementById("contact-subject").value;
  const message = document.getElementById("contact-message").value;

  const text = `Hello Hadassah Hope Foundation (RN: 10009677),%0A%0A*Subject:* ${encodeURIComponent(subject)}%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Message:* ${encodeURIComponent(message)}`;
  window.open(`https://wa.me/2347048350655?text=${text}`, "_blank");
}

document.querySelectorAll(".counter").forEach((counter) => {
  const target = +counter.getAttribute("data-target");
  let count = 0;
  const step = Math.ceil(target / 50);
  const timer = setInterval(() => {
    count += step;
    if (count >= target) {
      counter.innerText = target.toLocaleString() + "+";
      clearInterval(timer);
    } else {
      counter.innerText = count.toLocaleString();
    }
  }, 30);
});

loadBankDetails();
renderGalleries();




