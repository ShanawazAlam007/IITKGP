document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    const usernameIcon = document.querySelector('.input-icon');

    // Username validation
    usernameInput.addEventListener('input', () => {
        const username = usernameInput.value.trim();
        const isValid = username.length >= 3;
        
        usernameInput.classList.toggle('valid', isValid);
        usernameInput.classList.toggle('invalid', !isValid);
        
        usernameIcon.innerHTML = isValid 
            ? '<i class="fas fa-check-circle"></i>' 
            : '<i class="fas fa-times-circle"></i>';
    });

    // Password toggle visibility
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        passwordToggle.innerHTML = type === 'password'
            ? '<i class="fas fa-eye-slash"></i>'
            : '<i class="fas fa-eye"></i>';
    });

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Basic client-side validation
        if (username.length < 3) {
            alert('Please enter a valid username');
            return;
        }
        
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        
        // Simulate login (replace with actual authentication logic)
        console.log('Login attempt:', { username, password });
        alert('Login successful! (This is a simulation)');
    });
});
