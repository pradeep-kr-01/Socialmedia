// Load user data from localStorage (simulating users.json file)
function loadUserData() {
    let storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        return JSON.parse(storedUsers);
    } else {
        // Initial default users (as a fallback)
        return [
            { id: 'user1', name: 'Pradeep Kr', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { id: 'user2', name: 'Mrinal Bhradwaj', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' }
        ];
    }
}

// Save user data to localStorage (simulating saving to JSON file)
function saveUserData(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Initialize user data
let users = loadUserData();
let currentUser = null;

// Pre-existing posts
const preExistingPosts = [
    {
        id: 1,
        userId: 'user1',
        imageUrl: 'https://picsum.photos/id/1015/600/400',
        caption: 'Beautiful mountain landscape!',
        likes: 15,
        comments: [{ userId: 'user2', text: 'Wow, amazing view!' }]
    },
    {
        id: 2,
        userId: 'user2',
        imageUrl: 'https://picsum.photos/id/1025/600/400',
        caption: 'My furry friend',
        likes: 20,
        comments: [{ userId: 'user1', text: 'So cute!' }]
    }
];
let posts = [...preExistingPosts];

// Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const createAccountForm = document.getElementById('createAccountForm');
const searchWrapper = document.getElementById('searchWrapper');
const userList = document.getElementById('userList');
const postForm = document.getElementById('postForm');
const postFeed = document.getElementById('postFeed');
const profileName = document.getElementById('profileName');
const profileAvatar = document.getElementById('profileAvatar');
const profileDropdown = document.getElementById('profileDropdown');
const profileDropdownBtn = document.getElementById('profileDropdownBtn');
const toggleModeBtn = document.getElementById('toggleModeBtn');

// Hide everything except login on page load
window.onload = () => {
    loginModal.style.display = 'flex';
    searchWrapper.style.display = 'none';
    document.querySelector('main').style.display = 'none';
    profileDropdown.style.display = 'none'; // Hide profile dropdown
};

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Simple check for example (replace with actual authentication)
    const foundUser = users.find(user => user.name === username);
    if (foundUser) {
        currentUser = foundUser;
        loadUserProfile();
        loginModal.style.display = 'none';
        searchWrapper.style.display = 'block';
        document.querySelector('main').style.display = 'block';
        profileDropdown.style.display = 'block'; // Show profile dropdown
    } else {
        alert("Invalid credentials, try again!");
    }
});

// Handle account creation
createAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newUserName = document.getElementById('newUser').value.trim();
    const newUser = {
        id: `user${users.length + 1}`,
        name: newUserName,
        avatarUrl: 'https://randomuser.me/api/portraits/lego/1.jpg'
    };
    users.push(newUser);
    saveUserData(users); // Save the new user to localStorage
    currentUser = newUser;
    loadUserProfile();
    loginModal.style.display = 'none';
    searchWrapper.style.display = 'block';
    document.querySelector('main').style.display = 'block';
    profileDropdown.style.display = 'block'; // Show profile dropdown
    alert(`Account created for ${newUser.name}`);
});

function loadUserProfile() {
    profileName.textContent = currentUser.name;
    profileAvatar.src = currentUser.avatarUrl;
}

// Switch between login and account creation forms
document.getElementById('createAccountBtn').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    createAccountForm.style.display = 'block';
});

document.getElementById('loginLink').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'block';
    createAccountForm.style.display = 'none';
});

// Sign out user and show login modal again
document.getElementById('signoutBtn').addEventListener('click', () => {
    alert("Signed out");
    // Ensure the modal is centered when the login page comes back
    loginModal.style.display = 'flex'; // Display the modal
    document.querySelector('main').style.display = 'none'; // Hide main content
    profileDropdown.style.display = 'none'; // Hide the profile dropdown
});

// Handle user search
document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm));
    displayUsers(filteredUsers);
});

function displayUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} (${user.id})`;
        userList.appendChild(li);
    });
}

// Handle post creation
postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const caption = document.getElementById('postCaption').value;
    const imageFile = document.getElementById('postImage').files[0];
    
    if (caption.trim() !== '' && imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const newPost = {
                id: Date.now(),
                userId: currentUser.id,
                imageUrl: event.target.result,
                caption: caption,
                likes: 0,
                comments: []
            };
            posts.unshift(newPost);
            displayPosts();
            postForm.reset();
        };
        reader.readAsDataURL(imageFile);
    }
});

// Display posts
function displayPosts() {
    postFeed.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <div class="post-header">
                <strong>${users.find(u => u.id === post.userId).name}</strong>
            </div>
            <img src="${post.imageUrl}" alt="Post Image" class="post-image">
            <p class="post-caption">${post.caption}</p>
            <div class="post-footer">
                <button onclick="likePost(${post.id})">
                    <i class="fas fa-heart"></i> ${post.likes}
                </button>
            </div>
        `;
        postFeed.appendChild(postDiv);
    });
}

// Like a post
function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes += 1;
        displayPosts();
    }
}


// Toggle day/night mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = toggleModeBtn.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

toggleModeBtn.addEventListener('click', toggleDarkMode);

// Initial rendering
displayPosts();

// Updated displayUsers function to add "Follow" button
function displayUsers(users) {
    userList.innerHTML = ''; // Clear previous results
    users.forEach(user => {
        if (user.id !== currentUser.id) { // Avoid showing follow option for self
            const li = document.createElement('li');
            li.classList.add('user-item');
            li.innerHTML = `
                <span>${user.name}</span>
                <button onclick="sendFollowRequest('${user.id}')">Follow</button>
            `;
            userList.appendChild(li);
        }
    });
}

// Update the sendFollowRequest function to check if a request already exists
function sendFollowRequest(userId) {
    const existingRequest = followRequests.find(
        request => request.from === currentUser.id && request.to === userId && request.status === 'pending'
    );

    if (!existingRequest) {
        followRequests.push({ from: currentUser.id, to: userId, status: 'pending' });
        displayNotification(`Follow request sent to ${users.find(user => user.id === userId).name}.`);
    } else {
        displayNotification('Follow request already sent.');
    }
}

// Call displayUsers after user search
document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm));
    displayUsers(filteredUsers);
});


// Add follow requests array to simulate backend storage
let followRequests = [];

// Function to send a follow request
function sendFollowRequest(userId) {
    if (currentUser && currentUser.id !== userId) {
        followRequests.push({ from: currentUser.id, to: userId, status: 'pending' });
        displayNotification(`${users.find(user => user.id === userId).name} received your follow request.`);
    }
}

// Function to display follow requests in the notification section
function displayNotifications() {
    const notificationsBtn = document.getElementById('notificationsBtn');
    notificationsBtn.addEventListener('click', () => {
        const notifications = followRequests
            .filter(request => request.to === currentUser.id && request.status === 'pending')
            .map(request => {
                const requester = users.find(user => user.id === request.from);
                return `
                    <li>
                        ${requester.name} wants to follow you
                        <button onclick="acceptFollowRequest('${request.from}')">Accept</button>
                        <button onclick="denyFollowRequest('${request.from}')">Deny</button>
                    </li>
                `;
            }).join('');
        document.getElementById('notificationsList').innerHTML = notifications || "<li>No notifications</li>";
    });
}

// Accept or deny a follow request
function acceptFollowRequest(fromUserId) {
    const request = followRequests.find(req => req.from === fromUserId && req.to === currentUser.id);
    if (request) {
        request.status = 'accepted';
        displayNotification(`You are now following ${users.find(user => user.id === fromUserId).name}.`);
    }
}

function denyFollowRequest(fromUserId) {
    const request = followRequests.find(req => req.from === fromUserId && req.to === currentUser.id);
    if (request) {
        request.status = 'denied';
        displayNotification(`${users.find(user => user.id === fromUserId).name}'s follow request was denied.`);
    }
}

// Display general notifications
function displayNotification(message) {
    const notificationArea = document.createElement('div');
    notificationArea.classList.add('notification');
    notificationArea.innerText = message;
    document.body.appendChild(notificationArea);
    setTimeout(() => notificationArea.remove(), 3000);
}

// Call notification display on load
window.onload = () => {
    displayNotifications();
    // Other existing onload operations...
}
