/**
 * Play a sound using the specified sound ID.
 * @param {string} soundId - The ID of the audio element to play.
 */
function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.play();
    }
}

// Function to get the current date in ddmmyy format
function getCurrentDateInDDMMYY() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed)
    const year = String(today.getFullYear()).slice(-2); // Get last two digits of the year

    return `${day}/${month}/${year}`; // Combine to ddmmyy format
}
const formattedDate = getCurrentDateInDDMMYY();

/**
 * Calculate and display the user's carbon emissions based on their inputs.
 */
function calculateEmissions() {
    playSound('clickSound');  // Play click sound

    const resultsElement = document.getElementById('results');
    const recommendationsElement = document.getElementById('recommendations');

    // Retrieve and convert input values
    const distance = document.getElementById('distance').value * 365;
    const electricity = document.getElementById('electricity').value * 12;
    const waste = document.getElementById('waste').value * 52;
    const meals = document.getElementById('meals').value * 365;

    // Define emission factors for different countries
    const emissionFactors = {
        "india": { "Transportation": 0.13, "Electricity": 0.79, "Diet": 1.20, "Waste": 0.09 },
        "usa": { "Transportation": 0.25, "Electricity": 0.42, "Diet": 1.90, "Waste": 0.14 },
        "uk": { "Transportation": 0.19, "Electricity": 0.24, "Diet": 1.45, "Waste": 0.11 },
        "germany": { "Transportation": 0.20, "Electricity": 0.30, "Diet": 1.65, "Waste": 0.12 },
        "australia": { "Transportation": 0.28, "Electricity": 0.73, "Diet": 2.10, "Waste": 0.17 }
    };

    const country = document.getElementById('country').value.toLowerCase();
    const emissions = emissionFactors[country];

    // Calculate emissions for each category
    const transportationEmissions = emissions["Transportation"] * distance / 1000;
    const electricityEmissions = emissions["Electricity"] * electricity / 1000;
    const dietEmissions = emissions["Diet"] * meals / 1000;
    const wasteEmissions = emissions["Waste"] * waste / 1000;

    // Calculate total emissions
    const totalEmissions = transportationEmissions + electricityEmissions + dietEmissions + wasteEmissions;

    // Display results
    document.getElementById('resultsContent').innerHTML = `
        <h3>Carbon Emissions by Category</h3>
        <div class="info">🚗 Transportation: ${transportationEmissions.toFixed(2)} tonnes CO2 per year</div>
        <div class="info">💡 Electricity: ${electricityEmissions.toFixed(2)} tonnes CO2 per year</div>
        <div class="info">🗑️ Waste: ${wasteEmissions.toFixed(2)} tonnes CO2 per year</div>
        <div class="info">🍽️ Diet: ${dietEmissions.toFixed(2)} tonnes CO2 per year</div>
        <h3>Total Carbon Footprint</h3>
        <div class="success">🌍 Your total carbon footprint is: ${totalEmissions.toFixed(2)} tonnes CO2 per year</div>
    `;

    // Display recommendations
    const recommendations = [];

    if (transportationEmissions > 5) {
        recommendations.push("🚗 Consider reducing your daily commute by car or using public transportation.");
    } else if (transportationEmissions > 2) {
        recommendations.push("🚗 Try to carpool or bike for shorter commutes.");
    } else {
        recommendations.push("👍 Great job! Your transportation emissions are low.");
    }

    if (electricityEmissions > 3) {
        recommendations.push("💡 Consider switching to renewable energy sources or reducing electricity consumption.");
    } else if (electricityEmissions > 1.5) {
        recommendations.push("💡 Save energy by turning off lights and appliances when not in use.");
    } else {
        recommendations.push("👍 Well done! Your electricity usage is low.");
    }

    if (wasteEmissions > 0.3) {
        recommendations.push("🗑️ Consider enhancing recycling practices and reducing waste generation.");
    } else if (wasteEmissions > 0.1) {
        recommendations.push("🗑️ Optimize waste management and increase recycling efforts.");
    } else {
        recommendations.push("👍 Great job! Your waste management practices are effective.");
    }

    if (dietEmissions > 2.25) {
        recommendations.push("🍽️ Adopting a more plant-based diet could reduce your dietary emissions.");
    } else if (dietEmissions > 1.75) {
        recommendations.push("🍽️ Including more vegetarian meals in your diet could help lower your emissions.");
    } else {
        recommendations.push("👍 Nice work! Your diet has a minimal impact on emissions.");
    }

    document.getElementById('recommendationsContent').innerHTML = recommendations.map(rec => `<div class="recommendation">${rec}</div>`).join('<br>');

    // Show the results and recommendations
    resultsElement.style.display = 'block';
    recommendationsElement.style.display = 'block';

    // History of CO2 Emission
    const newText = `${texts.length + 1}.Your CO2 Emission was ${totalEmissions.toFixed(2)} on ${formattedDate}`;
    texts.push(newText);
}

/**
 * Close both results and recommendations boxes.
 */
function closeResults() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('recommendations').style.display = 'none';
    playSound('closeSound');  // Play Close sound
}

/**
 * Update the displayed value when the range slider input changes.
 */
document.getElementById('distance').oninput = function () {
    document.getElementById('distanceValue').textContent = this.value + ' km';
};
document.getElementById('electricity').oninput = function () {
    document.getElementById('electricityValue').textContent = this.value + ' kWh';
};
document.getElementById('waste').oninput = function () {
    document.getElementById('wasteValue').textContent = this.value + ' kg';
};

/* Script for history */
// Array to store the texts (simulating collected outputs)
const texts = [];

// Function to display all collected results
function showAllTexts() {
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.innerHTML = ''; // Clear previous content

    // Check if there are any texts to display
    if (texts.length === 0) {
        outputContainer.innerHTML = '<div>No results to display.</div>';
        // Hide the download button if there are no texts
        document.getElementById('dBtn').style.display = 'none';
    } else {
        texts.forEach((text) => {
            const textDiv = document.createElement('div');
            textDiv.classList.add('output');
            textDiv.innerHTML = `<pre>${text}</pre>`;
            outputContainer.appendChild(textDiv);
        });

        // Show the download button after displaying results
        document.getElementById('dBtn').style.display = 'block';

    }
}

// Function to download the collected texts as a .txt file
function downloadTexts() {
    const blob = new Blob([texts.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collected_texts.txt'; // Name of the file
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Release memory
}

// Example of how to add a new text
function addNewText(newText) {
    texts.push(newText);
    showAllTexts(); // Refresh the displayed results
}
