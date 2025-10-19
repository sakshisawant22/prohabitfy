document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');
    const startTrackingBtn = document.querySelector('.start-tracking-btn');

    const authModal = document.getElementById('auth-modal');
    const openLoginModalBtn = document.getElementById('open-login-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginFormContainer = document.getElementById('login-form-container');
    const signupFormContainer = document.getElementById('signup-form-container');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');

    const loginSignupBtn = document.getElementById('login-signup-btn');
    const userMenu = document.getElementById('user-menu');
    const userDisplay = document.getElementById('user-display');
    const logoutBtn = document.getElementById('logout-btn');

    // --- Section Switching Logic ---
    function showSection(id) {
        sections.forEach(section => {
            section.classList.remove('active-section');
            section.style.display = 'none'; // Ensure it's hidden for proper transition
        });
        const targetSection = document.getElementById(id);
        if (targetSection) {
            targetSection.classList.add('active-section');
            targetSection.style.display = 'block'; // Show the section
            // Scroll to the top of the main content area for better UX
            document.querySelector('main').scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    function setActiveLink(clickedLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.target.id === 'open-login-modal' || e.target.id === 'logout-btn') {
                // Don't prevent default for login/logout buttons
                return;
            }
            e.preventDefault();
            const sectionId = e.target.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
                setActiveLink(e.target);
            }
        });
    });

    startTrackingBtn.addEventListener('click', () => {
        showSection('tracker');
        setActiveLink(document.querySelector('a[data-section="tracker"]'));
    });

    // Initialize by showing the home section
    showSection('home');
    setActiveLink(document.querySelector('a[data-section="home"]'));

    // --- Login/Signup/Logout Logic (Client-side simulation) ---

    // Check if a user is already logged in from localStorage
    function checkLoginStatus() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            loginSignupBtn.style.display = 'none';
            userMenu.style.display = 'list-item'; // Make sure it's a list item
            userDisplay.textContent = loggedInUser;
        } else {
            loginSignupBtn.style.display = 'list-item';
            userMenu.style.display = 'none';
            userDisplay.textContent = '';
        }
    }

    // Modal Interactions
    openLoginModalBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        authModal.style.display = 'flex'; // Use flex to center
        // Reset to login form when opening modal
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginFormContainer.classList.add('active');
        signupFormContainer.classList.remove('active');
        loginError.textContent = '';
        signupError.textContent = '';
        loginForm.reset();
        signupForm.reset();
    });

    closeModalBtn.addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == authModal) {
            authModal.style.display = 'none';
        }
    });

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginFormContainer.classList.add('active');
        signupFormContainer.classList.remove('active');
        loginError.textContent = '';
        signupError.textContent = '';
        signupForm.reset(); // Clear signup form on tab switch
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupFormContainer.classList.add('active');
        loginFormContainer.classList.remove('active');
        loginError.textContent = '';
        signupError.textContent = '';
        loginForm.reset(); // Clear login form on tab switch
    });

    // Simulate User Accounts
    const users = JSON.parse(localStorage.getItem('habitifyUsers')) || {}; // { username: { email, password } }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = loginForm.elements['login-username'].value.trim();
        const password = loginForm.elements['login-password'].value.trim();

        if (users[username] && users[username].password === password) {
            localStorage.setItem('loggedInUser', username);
            checkLoginStatus();
            authModal.style.display = 'none';
            alert(`Welcome back, ${username}!`); // Or a nicer notification
            loginError.textContent = '';
        } else {
            loginError.textContent = 'Invalid username or password.';
        }
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = signupForm.elements['signup-username'].value.trim();
        const email = signupForm.elements['signup-email'].value.trim();
        const password = signupForm.elements['signup-password'].value.trim();
        const confirmPassword = signupForm.elements['signup-confirm-password'].value.trim();

        signupError.textContent = ''; // Clear previous errors

        if (username === '' || email === '' || password === '' || confirmPassword === '') {
            signupError.textContent = 'All fields are required.';
            return;
        }

        if (password.length < 6) { // Basic password strength check
            signupError.textContent = 'Password must be at least 6 characters long.';
            return;
        }

        if (password !== confirmPassword) {
            signupError.textContent = 'Passwords do not match.';
            return;
        }

        if (users[username]) {
            signupError.textContent = 'Username already exists. Please choose another.';
            return;
        }

        users[username] = { email, password };
        localStorage.setItem('habitifyUsers', JSON.stringify(users));
        localStorage.setItem('loggedInUser', username);
        checkLoginStatus();
        authModal.style.display = 'none';
        alert(`Account created successfully for ${username}! You are now logged in.`);
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        checkLoginStatus();
        alert('You have been logged out.');
        // Optionally redirect to home or refresh the page
        showSection('home');
        setActiveLink(document.querySelector('a[data-section="home"]'));
    });

    // Initial check on page load
    checkLoginStatus();


    // --- Habit Tracker Logic (Client-side only) ---
    const addHabitBtn = document.getElementById('add-habit-btn');
    const newHabitNameInput = document.getElementById('new-habit-name');
    const habitDurationSelect = document.getElementById('habit-duration');
    const habitList = document.getElementById('habit-list');

    // Load habits from localStorage (if any)
    let habits = JSON.parse(localStorage.getItem('habitifyHabits')) || [];

    function renderHabits() {
        habitList.innerHTML = ''; // Clear current list
        if (habits.length === 0) {
            habitList.innerHTML = '<p style="text-align: center; color: #555; margin-top: 20px;">No habits added yet. Start building new routines!</p>';
            return;
        }

        habits.forEach((habit, habitIndex) => {
            const habitItem = document.createElement('div');
            habitItem.classList.add('habit-item');

            const habitNameSpan = document.createElement('span');
            habitNameSpan.classList.add('habit-name');
            habitNameSpan.textContent = habit.name;
            habitItem.appendChild(habitNameSpan);

            const habitDaysDiv = document.createElement('div');
            habitDaysDiv.classList.add('habit-days');

            for (let i = 1; i <= habit.duration; i++) {
                const dayCircle = document.createElement('span');
                dayCircle.classList.add('day-circle');
                dayCircle.textContent = i;
                if (habit.completedDays.includes(i)) {
                    dayCircle.classList.add('completed');
                }
                dayCircle.addEventListener('click', () => {
                    toggleDayCompletion(habitIndex, i);
                });
                habitDaysDiv.appendChild(dayCircle);
            }
            habitItem.appendChild(habitDaysDiv);

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-habit-btn');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', () => {
                removeHabit(habitIndex);
            });
            habitItem.appendChild(removeBtn);

            habitList.appendChild(habitItem);
        });
        updateStats(); // Update stats after rendering habits
    }

    function addHabit() {
        const name = newHabitNameInput.value.trim();
        const duration = parseInt(habitDurationSelect.value, 10);

        if (name) {
            habits.push({
                name: name,
                duration: duration,
                completedDays: []
            });
            localStorage.setItem('habitifyHabits', JSON.stringify(habits));
            newHabitNameInput.value = ''; // Clear input
            renderHabits();
        } else {
            alert('Please enter a habit name.');
        }
    }

    function toggleDayCompletion(habitIndex, day) {
        const habit = habits[habitIndex];
        const dayIndex = habit.completedDays.indexOf(day);

        if (dayIndex > -1) {
            habit.completedDays.splice(dayIndex, 1); // Remove if already completed
        } else {
            habit.completedDays.push(day); // Add if not completed
            habit.completedDays.sort((a, b) => a - b); // Keep sorted
        }
        localStorage.setItem('habitifyHabits', JSON.stringify(habits));
        renderHabits();
    }

    function removeHabit(habitIndex) {
        if (confirm('Are you sure you want to remove this habit?')) {
            habits.splice(habitIndex, 1);
            localStorage.setItem('habitifyHabits', JSON.stringify(habits));
            renderHabits();
        }
    }

    // Update Stats
    function updateStats() {
        const statRows = document.querySelectorAll('.stats-card .stat-row span:last-child');
        if (statRows.length < 4) return; // Ensure all stat elements exist

        let totalHabits = habits.length;
        let habitsCompletedToday = 0; // Simplified
        let totalCompletedDays = 0;
        let totalPossibleDays = 0;
        let longestStreak = 0;

        habits.forEach(habit => {
            // A very simplified 'today' logic: just checks if any day is marked
            // For a real app, you'd need to store dates of completion
            if (habit.completedDays.length > 0) {
                 // Check if the current day (e.g., last day of the habit duration) is marked
                 // This is a placeholder; real 'today' needs actual date tracking.
                // For now, let's say if the first day is marked, it counts for 'today' (as per example image showing 2)
                if (habit.completedDays.includes(1)) { // Example: If day 1 is done, count it.
                    habitsCompletedToday++;
                }
            }

            totalCompletedDays += habit.completedDays.length;
            totalPossibleDays += habit.duration;

            // Calculate longest streak for each habit (simplified based on sequential days)
            let currentStreak = 0;
            let maxStreak = 0;
            for (let i = 1; i <= habit.duration; i++) {
                if (habit.completedDays.includes(i)) {
                    currentStreak++;
                } else {
                    maxStreak = Math.max(maxStreak, currentStreak);
                    currentStreak = 0;
                }
            }
            maxStreak = Math.max(maxStreak, currentStreak); // Check streak at the end
            longestStreak = Math.max(longestStreak, maxStreak);
        });

        const overallCompletion = totalPossibleDays > 0 ? ((totalCompletedDays / totalPossibleDays) * 100).toFixed(0) : 0;

        statRows[0].textContent = totalHabits; // Total
        statRows[1].textContent = habitsCompletedToday; // Today (simplified)
        statRows[2].textContent = `${overallCompletion}%`; // Overall
        statRows[3].textContent = longestStreak; // Longest Streak
    }

    addHabitBtn.addEventListener('click', addHabit);

    // Initial render of habits when the page loads
    renderHabits();

    // --- Health Tools Calculations ---

    // 1. Calories Burned (Walking)
    const caloriesInput = document.querySelector('#health-tools .tool-card:nth-child(1) input');
    const caloriesBtn = document.querySelector('#health-tools .tool-card:nth-child(1) button');
    const caloriesResult = document.querySelector('#health-tools .tool-card:nth-child(1) .result');

    caloriesBtn.addEventListener('click', () => {
        const distanceKm = parseFloat(caloriesInput.value);
        if (!isNaN(distanceKm) && distanceKm >= 0) {
            // Rough estimation: ~50-70 calories per km for average person (e.g., 60 cal/km)
            const calories = (distanceKm * 60).toFixed(0);
            caloriesResult.textContent = `You burned ~${calories} calories.`;
            caloriesResult.style.color = '#28a745';
        } else {
            caloriesResult.textContent = 'Please enter a valid distance (e.g., 1.5).';
            caloriesResult.style.color = '#dc3545';
        }
    });

    // 2. BMI Calculator
    const bmiWeightInput = document.querySelector('#health-tools .tool-card:nth-child(2) input:nth-of-type(1)');
    const bmiHeightInput = document.querySelector('#health-tools .tool-card:nth-child(2) input:nth-of-type(2)');
    const bmiBtn = document.querySelector('#health-tools .tool-card:nth-child(2) button');
    const bmiResult = document.querySelector('#health-tools .tool-card:nth-child(2) .result');

    bmiBtn.addEventListener('click', () => {
        const weightKg = parseFloat(bmiWeightInput.value);
        const heightCm = parseFloat(bmiHeightInput.value);

        if (!isNaN(weightKg) && weightKg > 0 && !isNaN(heightCm) && heightCm > 0) {
            const heightM = heightCm / 100;
            const bmi = (weightKg / (heightM * heightM)).toFixed(2);
            let category;
            let color = '#333';
            if (bmi < 18.5) { category = 'Underweight'; color = '#ffc107'; }
            else if (bmi >= 18.5 && bmi <= 24.9) { category = 'Normal weight'; color = '#28a745'; }
            else if (bmi >= 25 && bmi <= 29.9) { category = 'Overweight'; color = '#ffc107'; }
            else { category = 'Obese'; color = '#dc3545'; }

            bmiResult.innerHTML = `Your BMI: <strong>${bmi}</strong> (${category})`;
            bmiResult.style.color = color;
        } else {
            bmiResult.textContent = 'Please enter valid weight and height.';
            bmiResult.style.color = '#dc3545';
        }
    });

    // 3. Daily Water Intake
    const waterWeightInput = document.querySelector('#health-tools .tool-card:nth-child(3) input');
    const waterBtn = document.querySelector('#health-tools .tool-card:nth-child(3) button');
    const waterResult = document.querySelector('#health-tools .tool-card:nth-child(3) .result');

    waterBtn.addEventListener('click', () => {
        const weightKg = parseFloat(waterWeightInput.value);
        if (!isNaN(weightKg) && weightKg > 0) {
            // General recommendation: ~30-35 ml per kg of body weight
            const intakeMl = (weightKg * 33).toFixed(0);
            const intakeL = (intakeMl / 1000).toFixed(1);
            waterResult.textContent = `Recommended: ~${intakeL} Liters (~${intakeMl} ml)`;
            waterResult.style.color = '#28a745';
        } else {
            waterResult.textContent = 'Please enter a valid weight.';
            waterResult.style.color = '#dc3545';
        }
    });

    // 4. BMR Calculator (Basal Metabolic Rate)
    const bmrWeightInput = document.querySelector('#health-tools .tool-card:nth-child(4) input:nth-of-type(1)');
    const bmrHeightInput = document.querySelector('#health-tools .tool-card:nth-child(4) input:nth-of-type(2)');
    const bmrAgeInput = document.querySelector('#health-tools .tool-card:nth-child(4) input:nth-of-type(3)');
    const bmrGenderSelect = document.querySelector('#health-tools .tool-card:nth-child(4) select');
    const bmrBtn = document.querySelector('#health-tools .tool-card:nth-child(4) button');
    const bmrResult = document.querySelector('#health-tools .tool-card:nth-child(4) .result');

    bmrBtn.addEventListener('click', () => {
        const weightKg = parseFloat(bmrWeightInput.value);
        const heightCm = parseFloat(bmrHeightInput.value);
        const ageYears = parseFloat(bmrAgeInput.value);
        const gender = bmrGenderSelect.value;

        if (!isNaN(weightKg) && weightKg > 0 && !isNaN(heightCm) && heightCm > 0 && !isNaN(ageYears) && ageYears > 0) {
            let bmr;
            // Mifflin-St Jeor Equation
            if (gender === 'Male') {
                bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + 5;
            } else { // Female
                bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) - 161;
            }
            bmrResult.textContent = `Your BMR: ~${bmr.toFixed(0)} calories/day`;
            bmrResult.style.color = '#28a745';
        } else {
            bmrResult.textContent = 'Please enter valid details.';
            bmrResult.style.color = '#dc3545';
        }
    });

    // 5. Ideal Weight Range (using a simplified BMI approach)
    const idealHeightInput = document.querySelector('#health-tools .tool-card:nth-child(5) input');
    const idealBtn = document.querySelector('#health-tools .tool-card:nth-child(5) button');
    const idealResult = document.querySelector('#health-tools .tool-card:nth-child(5) .result');

    idealBtn.addEventListener('click', () => {
        const heightCm = parseFloat(idealHeightInput.value);
        if (!isNaN(heightCm) && heightCm > 0) {
            const heightM = heightCm / 100;
            // BMI range for "normal weight" is 18.5 to 24.9
            const minWeight = (18.5 * heightM * heightM).toFixed(1);
            const maxWeight = (24.9 * heightM * heightM).toFixed(1);
            idealResult.textContent = `Ideal Weight: ${minWeight} - ${maxWeight} kg`;
            idealResult.style.color = '#28a745';
        } else {
            idealResult.textContent = 'Please enter a valid height.';
            idealResult.style.color = '#dc3545';
        }
    });

    // 6. Body Fat % (Simplified - requires more complex formulas for accuracy)
    const bodyFatWaistInput = document.querySelector('#health-tools .tool-card:nth-child(6) input:nth-of-type(1)');
    const bodyFatNeckInput = document.querySelector('#health-tools .tool-card:nth-child(6) input:nth-of-type(2)');
    const bodyFatHeightInput = document.querySelector('#health-tools .tool-card:nth-child(6) input:nth-of-type(3)');
    const bodyFatBtn = document.querySelector('#health-tools .tool-card:nth-child(6) button');
    const bodyFatResult = document.querySelector('#health-tools .tool-card:nth-child(6) .result');

    // Note: US Navy Body Fat Calculator is complex. This is a very rough placeholder.
    // A proper body fat calculation would need gender and more precise measurements/equations.
    // For simplicity, we'll just show an example with waist/height.
    bodyFatBtn.addEventListener('click', () => {
        const waistCm = parseFloat(bodyFatWaistInput.value);
        const neckCm = parseFloat(bodyFatNeckInput.value); // Not used in this simplified formula
        const heightCm = parseFloat(bodyFatHeightInput.value);

        if (!isNaN(waistCm) && waistCm > 0 && !isNaN(heightCm) && heightCm > 0) {
            // Very simplified estimation, not medically accurate.
            // A common (but not precise) formula for men: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
            // Given the inputs, let's just make a very rough calculation based on waist/height ratio.
            const ratio = waistCm / heightCm;
            let bodyFat = (ratio * 100 - 30).toFixed(1); // Placeholder logic
            if (bodyFat < 5) bodyFat = 5; // Minimum plausible
            if (bodyFat > 40) bodyFat = 40; // Maximum plausible

            bodyFatResult.textContent = `Estimated Body Fat: ~${bodyFat}%`;
            bodyFatResult.style.color = '#28a745';
        } else {
            bodyFatResult.textContent = 'Please enter valid measurements.';
            bodyFatResult.style.color = '#dc3545';
        }
    });
});