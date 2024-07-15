document.addEventListener('DOMContentLoaded', function() {
    const artGallery = document.getElementById('artGallery');
    const artworkForm = document.getElementById('artworkForm');
    const loginForm = document.getElementById('loginForm');
    const navbar = document.getElementById('navbar');
    let isAdmin = false; // Initially, no one is authenticated

    // Function to check authentication status (could be more complex logic)
    function checkAuthentication() {
        // Replace with actual authentication logic
        // For example, you might check a session token or credentials stored in localStorage
        isAdmin = localStorage.getItem('isAdmin') === 'true';
        updateNavigation(); // Update navigation buttons based on isAdmin status
    }

    // Call checkAuthentication initially to set isAdmin based on localStorage
    checkAuthentication();

    // Function to load artworks from localStorage
    function loadArtworks() {
        if (artGallery) {  // Check if artGallery exists
            const artworks = JSON.parse(localStorage.getItem('artworks')) || [];
            console.log('Loading artworks:', artworks);
            artGallery.innerHTML = ''; // Clear the gallery before loading artworks
            artworks.forEach((artwork, index) => {
                addArtworkToGallery(artwork, index);
            });
        }
    }

    // Function to add artwork to gallery
    // Function to add artwork to gallery
    function addArtworkToGallery(artwork, index) {
        if (artGallery) {  // Check if artGallery exists
            const artworkHTML = `
                <div class="artwork" data-index="${index}">
                    <a href="artwork.html?index=${index}">
                        <img src="${artwork.imageDataURL}" alt="${artwork.title}">
                        <h3>${artwork.title}</h3>
                        <p>${artwork.description}</p>
                        ${isAdmin ? `<button class="deleteButton">Delete</button>` : ''}
                    </a>
                </div>
            `;
            artGallery.insertAdjacentHTML('beforeend', artworkHTML);

            // Add event listener to the delete button (only if admin)
            if (isAdmin) {
                const deleteButton = artGallery.querySelector(`.artwork[data-index="${index}"] .deleteButton`);
                deleteButton.addEventListener('click', function() {
                    deleteArtwork(index);
                });
            }
        }
    }



    // Event listener for form submission (only if admin)
    if (artworkForm) {
        artworkForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (isAdmin) {
                console.log('Form submitted');

                // Get form values
                const title = document.getElementById('title').value;
                const imageFile = document.getElementById('image').files[0];
                const description = document.getElementById('description').value;
                console.log('Title:', title);
                console.log('Description:', description);
                console.log('Image File:', imageFile);

                // Create artwork object
                const artwork = { title, description };

                // Read image file as data URL
                const reader = new FileReader();
                reader.onload = function(event) {
                    console.log('File read successfully');
                    artwork.imageDataURL = event.target.result;

                    // Add artwork to localStorage
                    let artworks = JSON.parse(localStorage.getItem('artworks')) || [];
                    artworks.push(artwork);
                    localStorage.setItem('artworks', JSON.stringify(artworks));
                    console.log('Artwork added to localStorage:', artworks);

                    // Clear the form
                    artworkForm.reset();

                    // Add artwork to gallery immediately
                    if (artGallery) {
                        addArtworkToGallery(artwork, artworks.length - 1);
                    }
                };

                // Handle file read error
                reader.onerror = function(error) {
                    console.error('Error reading file:', error);
                };

                // Read the selected file as a data URL
                if (imageFile) {
                    reader.readAsDataURL(imageFile);
                } else {
                    console.error('No image selected');
                }
            } else {
                alert('You are not authenticated to add artwork.');
            }
        });
    }

    // Function to delete artwork (only if admin)
    function deleteArtwork(index) {
        let artworks = JSON.parse(localStorage.getItem('artworks')) || [];
        artworks.splice(index, 1);
        localStorage.setItem('artworks', JSON.stringify(artworks));
        console.log('Artwork deleted:', artworks);
        loadArtworks(); // Reload artworks after deletion
    }

    // Event listener for login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Replace with actual authentication logic (e.g., check against hardcoded credentials)
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Example of hardcoded authentication (replace with secure authentication method)
            if (username === 'admin' && password === 'password') {
                isAdmin = true;
                localStorage.setItem('isAdmin', 'true');
                alert('Login successful!');
                updateNavigation(); // Update navigation buttons after successful login
            } else {
                alert('Login failed. Please try again.');
                isAdmin = false;
                localStorage.removeItem('isAdmin');
                updateNavigation(); // Update navigation buttons after failed login
            }
        });
    }

    // Function to update navigation buttons based on isAdmin status
    function updateNavigation() {
        const loginButton = document.getElementById('loginButton');
        const addArtworkButton = document.getElementById('addArtworkButton');
    
        if (isAdmin) {
            // Replace Login button with Logout button
            loginButton.innerHTML = '<a href="#" id="logoutButton">Logout</a>';
            addArtworkButton.style.display = 'inline'; // Show Add Artwork button
            
            const logoutButton = document.getElementById('logoutButton');
            logoutButton.addEventListener('click', function(event) {
                event.preventDefault();
                isAdmin = false;
                localStorage.removeItem('isAdmin');
                updateNavigation(); // Update navigation buttons after logout
                alert('Logged out successfully.');
                window.location.href = window.location.href; // Refresh the page after logout
            });
        } else {
            // Show Login button
            loginButton.innerHTML = '<a href="login.html">Login</a>';
            addArtworkButton.style.display = 'none'; // Hide Add Artwork button
        }
    }
    

    // Load artworks from localStorage on page load
    loadArtworks();
});
