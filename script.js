// User Data
let users = [
    { id: 'user1', name: 'Pradeep Kr', avatarUrl: 'https://image.tensorartassets.com/cdn-cgi/image/w=2048/model_showcase/0/c8486c06-5ecf-67e5-489a-bb72da812848.jpeg' },
    { id: 'user2', name: 'Mrinal Bhradwaj', avatarUrl: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bc31387a-5b1a-4e5b-ab64-73efd614c70d/width=450/12169-3417738061-_lora_ttg-03_1_%20ttg,%20simple%20background,%20basic%20background,%20,%20solo,%20full%20body,%20green%20background,%20smiling,%20%20%20_lora_alienx-10%20ben10_.jpeg' }
];

// Pre-existing posts
const preExistingPosts = [
    {
        id: 1,
        userId: 'user1',
        imageUrl: 'https://picsum.photos/id/1015/600/400',
        caption: 'Beautiful mountain landscape!',
        likes: 15,
        comments: [
            { userId: 'user2', text: 'Wow, amazing view!' }
        ]
    },
    {
        id: 2,
        userId: 'user2',
        imageUrl: 'https://picsum.photos/id/1025/600/400',
        caption: 'My furry friend',
        likes: 20,
        comments: [
            { userId: 'user1', text: 'So cute!' }
        ]
    }
];

let posts =   [...preExistingPosts];

// Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const userList = document.getElementById('userList');
const postForm = document.getElementById('postForm');
const postFeed = document.getElementById('postFeed');
const createIdBtn = document.getElementById('createIdBtn');
const createIdModal = document.getElementById('createIdModal');
const closeBtn = document.getElementsByClassName('closeBtn')[0];
const createIdForm = document.getElementById('createIdForm');
const newUserName = document.getElementById('newUserName');
const toggleModeBtn = document.getElementById('toggleModeBtn');

// Handle user search
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.id.toLowerCase().includes(searchTerm)
    );
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
                userId: 'user1',
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
                <button onclick="toggleComments(${post.id})">
                    <i class="fas fa-comment"></i> ${post.comments.length}
                </button>
            </div>
            <div class="comments" id="comments-${post.id}" style="display: none;">
                ${post.comments.map(comment => `
                    <p><strong>${users.find(u => u.id === comment.userId).name}</strong>: ${comment.text}</p>
                `).join('')}
                <form onsubmit="addComment(event, ${post.id})">
                    <input type="text" placeholder="Add a comment" required>
                    <button type="submit">Post</button>
                </form>
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

// Toggle comments visibility
function toggleComments(postId) {
    const commentsDiv = document.getElementById(`comments-${postId}`);
    commentsDiv.style.display = commentsDiv.style.display === 'none' ? 'block' : 'none';
}

// Add a comment
function addComment(event, postId) {
    event.preventDefault();
    const post = posts.find(p => p.id === postId);
    const commentText = event.target.querySelector('input').value;
    post.comments.push({ userId: 'user1', text: commentText });
    displayPosts();
}

// Handle Create ID
createIdBtn.addEventListener('click', () => {
    createIdModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    createIdModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === createIdModal) {
        createIdModal.style.display = 'none';
    }
});

createIdForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = newUserName.value.trim();
    if (userName) {
        const newUser = {
            id: `user${users.length + 1}`,
            name: userName,
            avatarUrl: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bc31387a-5b1a-4e5b-ab64-73efd614c70d/width=450/12169-3417738061-_lora_ttg-03_1_%20ttg,%20simple%20background,%20basic%20background,%20,%20solo,%20full%20body,%20green%20background,%20smiling,%20%20%20_lora_alienx-10%20ben10_.jpeg'
        };
        users.push(newUser);
        alert(`User ID created: ${newUser.id}`);
        newUserName.value = '';
        createIdModal.style.display = 'none';
    }
});

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