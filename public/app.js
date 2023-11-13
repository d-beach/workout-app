const logPushUpButton = document.getElementById('logPushUpButton');
const logSitUpButton = document.getElementById('logSitUpButton');
const pushUpInput = document.getElementById('pushUpInput');
const sitUpInput = document.getElementById('sitUpInput');
const pushCount = document.getElementById('pushCount');
const sitCount = document.getElementById('sitCount');

// Initialize pushUpData and set it to what's in localStorage, or an empty object if it's not found
let workoutData = JSON.parse(localStorage.getItem('workoutData')) || { dailyCounts: [] };

// Initialize localStorage if it's not already set
if (!localStorage.getItem('workoutData')) {
    localStorage.setItem('workoutData', JSON.stringify(workoutData));
}

// Log Push-Ups or Sit-Ups (common function for both)
const logWorkout = async (type) => {
    let count;
    let inputField;
    let countElement;
    let workType; 

    if (type === 'pushUp') {
        count = parseInt(pushUpInput.value);
        inputField = pushUpInput;
        countElement = pushCount;
        workType = 'push-up'

    } else if (type === 'sitUp') {
        count = parseInt(sitUpInput.value);
        inputField = sitUpInput;
        countElement = sitCount;
        workType = 'sit-up'
    }

    if (!count || count <= 0) return;

    // Update workoutData with the new entry
    workoutData.dailyCounts.push({ type, date: new Date().toDateString(), count });

    // Update localStorage with the new data
    localStorage.setItem('workoutData', JSON.stringify(workoutData));

    // Send an API request to the backend to log push-ups or sit-ups
    try {
        const response = await fetch(`/log-${workType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, count }),
        });

        if (response.ok) {
            // Workout logged successfully, update UI as needed
            updateWorkoutCount(type);
            inputField.value = ''; // Clear the input field
        } else {
            // Handle errors from the server
            console.error(`Failed to log ${type}`, response);
        }
    } catch (error) {
        console.error(`Error while logging ${type}`, error);
    }
};

// Function to update the total Push-Up or Sit-Up count
const updateWorkoutCount = (type) => {
    const today = new Date().toDateString();
    let totalWorkouts = 0;

    // Use local storage to keep track of workout counts
    const storedData = localStorage.getItem('workoutData');

    if (storedData) {
        // Parse the stored data
        const workoutData = JSON.parse(storedData);

        for (const entry of workoutData.dailyCounts) {
            if (entry.date === today && entry.type === type) {
                totalWorkouts += entry.count;
            }
        }
    }

    const countElement = type === 'pushUp' ? pushCount : sitCount;
    countElement.textContent = totalWorkouts;
};

logPushUpButton.addEventListener('click', () => logWorkout('pushUp'));
logSitUpButton.addEventListener('click', () => logWorkout('sitUp'));

// Automatically create a new date entry when a new day starts
setInterval(() => {
    const today = new Date().toDateString();
    const types = ['pushUp', 'sitUp'];
    types.forEach((type) => {
        if (!workoutData.dailyCounts.find((entry) => entry.date === today && entry.type === type)) {
            workoutData.dailyCounts.push({ type, date: today, count: 0 });
            updateWorkoutCount(type);
        }
    });
}, 60000); // Check every minute for a new day

// Initial update of the total Push-Up and Sit-Up count
updateWorkoutCount('pushUp');
updateWorkoutCount('sitUp');