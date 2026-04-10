/**
 * Auth script to protect pages and handle session logic via localStorage
 */

const userJSON = localStorage.getItem('paper_user');
const currentUser = userJSON ? JSON.parse(userJSON) : null;

// Routing logic
const currentPath = window.location.pathname;
const isAuthPage = currentPath.includes('login.html') || currentPath.includes('signup.html');

if (!currentUser && !isAuthPage) {
    // Redirect unauthenticated users back to login
    window.location.href = 'login.html';
} else if (currentUser && isAuthPage) {
    // Redirect authenticated users away from auth pages
    window.location.href = 'index.html';
}

// Global UI bindings on load
document.addEventListener("DOMContentLoaded", () => {
    if (currentUser) {
        // Render name
        const nameDisplays = document.querySelectorAll('.user-name-display');
        nameDisplays.forEach(el => el.textContent = currentUser.name);
        
        // Render Avatar initial
        const avatarDisplays = document.querySelectorAll('.user-avatar-display');
        avatarDisplays.forEach(el => el.textContent = currentUser.name.charAt(0).toUpperCase());

        // Setup topbar profile button
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
