
const userJSON = localStorage.getItem('paper_user');
const currentUser = userJSON ? JSON.parse(userJSON) : null;


const currentPath = window.location.pathname;
const isAuthPage = currentPath.includes('login.html') || currentPath.includes('signup.html');

if (!currentUser && !isAuthPage) {
    window.location.href = 'login.html';
} else if (currentUser && isAuthPage) {
    window.location.href = 'index.html';
}

document.addEventListener("DOMContentLoaded", () => {
    if (currentUser) {
        const nameDisplays = document.querySelectorAll('.user-name-display');
        nameDisplays.forEach(el => el.textContent = currentUser.name);
        
        const avatarDisplays = document.querySelectorAll('.user-avatar-display');
        avatarDisplays.forEach(el => el.textContent = currentUser.name.charAt(0).toUpperCase());

        const profileBtn = document.getElementById('nav-profile-logo');
        if (profileBtn) {
            profileBtn.title = "Go to Profile";
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'profile.html';
            });
        }
    }
});
