// App State Management
class AppManager {
    constructor() {
        this.currentPage = 'home';
        this.quiz = new QuizApp();
        this.joke = new JokeApp();
        this.weather = new WeatherApp();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAppCards();
    }

    setupNavigation() {
        const backBtn = document.getElementById('backBtn');
        backBtn.addEventListener('click', () => this.showPage('home'));
    }

    setupAppCards() {
        const appCards = document.querySelectorAll('.app-card');
        appCards.forEach(card => {
            card.addEventListener('click', () => {
                const appName = card.dataset.app;
                this.showPage(appName);
            });
        });
    }

    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(pageName + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
        }

        // Show/hide navigation
        const nav = document.getElementById('navigation');
        if (pageName === 'home') {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }

        // Initialize app if needed
        if (pageName === 'quiz') {
            this.quiz.init();
        } else if (pageName === 'joke') {
            this.joke.init();
        } else if (pageName === 'weather') {
            this.weather.init();
        }
    }

    showLoading(text = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        loadingText.textContent = text;
        overlay.classList.remove('hidden');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.add('hidden');
    }
}

// Quiz App
class QuizApp {
    constructor() {
        this.questions = [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1
            },
            {
                question: "What is the largest mammal in the world?",
                options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
                correct: 1
            },
            {
                question: "In which year did World War II end?",
                options: ["1944", "1945", "1946", "1947"],
                correct: 1
            },
            {
                question: "What is the chemical symbol for gold?",
                options: ["Go", "Gd", "Au", "Ag"],
                correct: 2
            }
        ];
        
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.showingResult = false;
    }

    init() {
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.showingResult = false;
        
        document.getElementById('quizContent').classList.remove('hidden');
        document.getElementById('quizResults').classList.add('hidden');
        
        this.setupEventListeners();
        this.displayQuestion();
        this.updateProgress();
    }

    setupEventListeners() {
        const nextBtn = document.getElementById('nextBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        nextBtn.addEventListener('click', () => this.handleNext());
        restartBtn.addEventListener('click', () => this.init());
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionText = document.getElementById('questionText');
        const optionsContainer = document.getElementById('optionsContainer');
        const nextBtn = document.getElementById('nextBtn');

        questionText.textContent = question.question;
        
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.innerHTML = `
                <input type="radio" name="answer" value="${index}" id="option${index}">
                <label for="option${index}">${option}</label>
            `;
            
            optionDiv.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(optionDiv);
        });

        nextBtn.disabled = true;
        nextBtn.textContent = this.currentQuestion === this.questions.length - 1 ? 'Finish Quiz' : 'Next Question';
    }

    selectAnswer(answerIndex) {
        if (this.showingResult) return;

        this.selectedAnswer = answerIndex;
        
        // Update UI
        document.querySelectorAll('.option').forEach((option, index) => {
            option.classList.remove('selected');
            if (index === answerIndex) {
                option.classList.add('selected');
            }
        });

        document.getElementById('nextBtn').disabled = false;
    }

    handleNext() {
        if (this.selectedAnswer === null) return;

        const correct = this.questions[this.currentQuestion].correct;
        
        // Show correct/incorrect answers
        document.querySelectorAll('.option').forEach((option, index) => {
            if (index === correct) {
                option.classList.add('correct');
            } else if (index === this.selectedAnswer && index !== correct) {
                option.classList.add('incorrect');
            }
        });

        // Update score
        if (this.selectedAnswer === correct) {
            this.score++;
        }

        this.showingResult = true;
        document.getElementById('nextBtn').disabled = true;

        // Move to next question or show results
        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                this.currentQuestion++;
                this.selectedAnswer = null;
                this.showingResult = false;
                this.displayQuestion();
                this.updateProgress();
            } else {
                this.showResults();
            }
        }, 1500);
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('questionNumber').textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        document.getElementById('scoreDisplay').textContent = `Score: ${this.score}`;
    }

    showResults() {
        document.getElementById('quizContent').classList.add('hidden');
        document.getElementById('quizResults').classList.remove('hidden');
        
        const finalScore = document.getElementById('finalScore');
        const scoreMessage = document.getElementById('scoreMessage');
        
        finalScore.textContent = `${this.score}/${this.questions.length}`;
        
        let message;
        if (this.score === this.questions.length) {
            message = "Perfect! 🎉";
        } else if (this.score >= this.questions.length * 0.8) {
            message = "Great job! 👏";
        } else if (this.score >= this.questions.length * 0.6) {
            message = "Good effort! 👍";
        } else {
            message = "Keep practicing! 💪";
        }
        
        scoreMessage.textContent = message;
    }
}

// Joke App
class JokeApp {
    constructor() {
        this.currentJoke = null;
    }

    init() {
        this.setupEventListeners();
        this.resetDisplay();
    }

    setupEventListeners() {
        const getJokeBtn = document.getElementById('getJokeBtn');
        const showPunchlineBtn = document.getElementById('showPunchlineBtn');
        
        getJokeBtn.addEventListener('click', () => this.fetchJoke());
        showPunchlineBtn.addEventListener('click', () => this.showPunchline());
    }

    resetDisplay() {
        document.getElementById('jokeDisplay').classList.remove('hidden');
        document.getElementById('jokeCard').classList.add('hidden');
    }

    async fetchJoke() {
        const category = document.getElementById('jokeCategory').value;
        const getJokeBtn = document.getElementById('getJokeBtn');
        
        // Show loading state
        getJokeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Joke...';
        getJokeBtn.disabled = true;

        try {
            const categoryParam = category === 'Any' ? '' : category;
            const response = await fetch(
                `https://v2.jokeapi.dev/joke/${categoryParam}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch joke');
            }

            const jokeData = await response.json();
            this.displayJoke(jokeData);
        } catch (error) {
            console.error('Error fetching joke:', error);
            // Fallback joke
            const fallbackJoke = {
                setup: "Why don't scientists trust atoms?",
                delivery: "Because they make up everything!",
                category: "Science",
                type: "twopart"
            };
            this.displayJoke(fallbackJoke);
        } finally {
            // Reset button
            getJokeBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Get New Joke';
            getJokeBtn.disabled = false;
        }
    }

    displayJoke(jokeData) {
        this.currentJoke = jokeData;
        
        // Hide placeholder, show joke card
        document.getElementById('jokeDisplay').classList.add('hidden');
        document.getElementById('jokeCard').classList.remove('hidden');
        
        // Update joke content
        const categoryEl = document.querySelector('.joke-category');
        const setupEl = document.getElementById('jokeSetup');
        const punchlineEl = document.getElementById('jokePunchline');
        const showPunchlineBtn = document.getElementById('showPunchlineBtn');
        
        categoryEl.textContent = `${jokeData.category} • ${jokeData.type === 'twopart' ? 'Setup & Punchline' : 'One-liner'}`;
        
        if (jokeData.type === 'twopart') {
            setupEl.textContent = jokeData.setup;
            punchlineEl.textContent = jokeData.delivery;
            punchlineEl.classList.add('hidden');
            showPunchlineBtn.classList.remove('hidden');
        } else {
            setupEl.textContent = jokeData.joke;
            punchlineEl.classList.add('hidden');
            showPunchlineBtn.classList.add('hidden');
        }
        
        // Add fade-in animation
        document.getElementById('jokeCard').classList.add('fade-in');
    }

    showPunchline() {
        const punchlineEl = document.getElementById('jokePunchline');
        const showPunchlineBtn = document.getElementById('showPunchlineBtn');
        
        punchlineEl.classList.remove('hidden');
        showPunchlineBtn.classList.add('hidden');
    }
}

// Weather App
class WeatherApp {
    constructor() {
        this.currentWeather = null;
    }

    init() {
        this.setupEventListeners();
        this.resetDisplay();
    }

    setupEventListeners() {
        const weatherForm = document.getElementById('weatherForm');
        weatherForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.fetchWeather();
        });
    }

    resetDisplay() {
        document.getElementById('weatherDisplay').classList.remove('hidden');
        document.getElementById('weatherCard').classList.add('hidden');
        document.getElementById('weatherError').classList.add('hidden');
    }

    async fetchWeather() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        const searchBtn = document.getElementById('searchBtn');
        
        // Show loading state
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        searchBtn.disabled = true;
        this.hideError();

        try {
            // Using wttr.in API - completely free, no registration required
            const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);

            if (!response.ok) {
                throw new Error('City not found. Please check the spelling and try again.');
            }

            const data = await response.json();

            if (!data.current_condition || data.current_condition.length === 0) {
                throw new Error('Weather data not available for this location.');
            }

            const current = data.current_condition[0];
            const location = data.nearest_area[0];

            const weatherData = {
                name: location.areaName[0].value,
                country: location.country[0].value,
                temperature: parseInt(current.temp_C),
                description: current.weatherDesc[0].value,
                humidity: parseInt(current.humidity),
                windSpeed: parseInt(current.windspeedKmph),
                visibility: parseInt(current.visibility),
                pressure: parseInt(current.pressure),
                feelsLike: parseInt(current.FeelsLikeC)
            };

            this.displayWeather(weatherData);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError(error.message || 'Unable to fetch weather data. Please try again.');
        } finally {
            // Reset button
            searchBtn.innerHTML = '<i class="fas fa-search"></i>';
            searchBtn.disabled = false;
        }
    }

    displayWeather(weatherData) {
        this.currentWeather = weatherData;
        
        // Hide placeholder and error, show weather card
        document.getElementById('weatherDisplay').classList.add('hidden');
        document.getElementById('weatherError').classList.add('hidden');
        document.getElementById('weatherCard').classList.remove('hidden');
        
        // Update weather content
        document.getElementById('locationName').textContent = `${weatherData.name}, ${weatherData.country}`;
        document.getElementById('temperature').textContent = `${weatherData.temperature}°C`;
        document.getElementById('weatherDescription').textContent = weatherData.description;
        document.getElementById('feelsLike').textContent = weatherData.feelsLike;
        document.getElementById('humidity').textContent = `${weatherData.humidity}%`;
        document.getElementById('windSpeed').textContent = `${weatherData.windSpeed} km/h`;
        document.getElementById('visibility').textContent = `${weatherData.visibility} km`;
        document.getElementById('pressure').textContent = `${weatherData.pressure} hPa`;
        
        // Add fade-in animation
        document.getElementById('weatherCard').classList.add('fade-in');
    }

    showError(message) {
        const errorEl = document.getElementById('weatherError');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        document.getElementById('weatherDisplay').classList.add('hidden');
        document.getElementById('weatherCard').classList.add('hidden');
    }

    hideError() {
        document.getElementById('weatherError').classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.appManager = new AppManager();
});