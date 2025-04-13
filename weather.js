// Necessary constant declarations
const weatherForm = document.querySelector('.weatherForm'); //stores first instance of the weatherForm class that takes city input and submits
const cityInput = document.querySelector('.cityInput'); //stores first instance of the cityInput class
const card = document.querySelector('.card'); //stores first instance of the weather card class
const apiKey = /*PASTE YOUR OWN CUSTOM API KEY HERE AS A STRING*/"; // OpenWeatherMap API key
// End of constant declarations

weatherForm.addEventListener("submit", async event => {

    event.preventDefault(); //prevents the default action of the form button submission, which is to refresh the page
    const city = cityInput.value.trim(); //gets the value of the city input field and removes any leading or trailing whitespace

    //checks if the city input is not empty and is a valid string
    if(city){
        try{
            const weatherData = await getWeatherData(city); //awaits the result of the getWeatherData function, which fetches data from the OpenWeatherMap API
            displayWeatherInfo(weatherData); //displays the weather information on the webpage
        }
        catch(error){
            console.error(error)
            displayError(error);
        };
    }
    else{
        displayError("Please enter a valid city...");
    }


}); //after clicking the submit button, the function will be executed with the "event" parameter

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    
    if(!response.ok){ //checks if the response is not ok (status code is not 200)
        throw new Error("Could not fetch weather data"); //throws an error if the city is not found
    }

    return await response.json();
}

function displayWeatherInfo(data){
//    console.log(data); //logs the weather data to the console for debugging purposes
    const {name: city, 
        main: {temp, humidity}, 
        weather: [{description, id}]} = data; //a singe large object with nested objects and arrays

    card.textContent = "";
    card.style.display = "flex";

    //recreated elements to display the weather information; were previously commented out in the HTML document
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
        

    //set created HTML elements with user gathered data
    cityDisplay.textContent = city;
    tempDisplay.textContent = `Temperature: ${((temp - 273.15) * (9/5) + 32).toFixed(1)}°F`; //converts temperature from Kelvin to Farenheit and rounds to 1 decimal place
    humidityDisplay.textContent = `Humidity: ${humidity}%`; //displays the humidity percentage
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);
    card.style.background = getGradientColor(id); //sets the background color of the card based on the weather condition
    cityDisplay.style.background = getGradientColor(id); //sets the background color of the city display based on the weather condition
    cityDisplay.style.border = "15px solid " + getTempColor(temp); //sets the text color of the temperature display based on the weather condition

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");


    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji); //appends the citys elements to the main card element noted in the HTML file
}

function getWeatherEmoji(weatherId){
    switch(true){
        case(weatherId >= 200 && weatherId < 300):
            return "⛈️"; //thunderstorm
        case(weatherId >= 300 && weatherId < 400):
            return "🌧️"; //drizzle
        case(weatherId >= 500 && weatherId < 600):
            return "🌧️"; //rain
        case(weatherId >= 600 && weatherId < 700):
            return "❄️"; //snow
        case(weatherId >= 700 && weatherId < 800):
            return "🌫️"; //mist 
        case(weatherId === 800):
            return "☀️"; //clear sky
        case(weatherId >= 801 && weatherId < 810):
            return "☁️"; //clouds
        default:
            return "❓";//unknown weather condition
    }
}

function getGradientColor(weatherId){
    switch(true){
        case(weatherId >= 200 && weatherId < 300):
            return "linear-gradient(180deg, hsl(207, 7.80%, 22.50%), hsl(225, 39.50%, 48.60%))"; //thunderstorm
        case(weatherId >= 300 && weatherId < 400):
            return "linear-gradient(180deg, hsl(206, 7.20%, 81.00%), hsl(202, 55.20%, 73.70%))"; //drizzle
        case(weatherId >= 500 && weatherId < 600):
            return "linear-gradient(180deg, hsl(210, 5.70%, 47.80%), hsl(202, 33.90%, 49.20%))"; //rain
        case(weatherId >= 600 && weatherId < 700):
            return "linear-gradient(180deg, hsl(203, 75.50%, 69.60%), hsl(202, 56.50%, 82.00%))"; //snow
        case(weatherId >= 700 && weatherId < 800):
            return "linear-gradient(180deg, hsl(214, 4.70%, 29.20%), hsl(210, 1.60%, 48.20%))"; //mist 
        case(weatherId === 800):
        return "linear-gradient(180deg, hsl(210, 100%, 75%), hsl(40, 100%, 75%))"; //clear sky
        case(weatherId >= 801 && weatherId < 810):
            return "linear-gradient(180deg, hsl(210, 7.40%, 73.30%), hsl(210, 100%, 75%), hsl(40, 100%, 75%))"; //clouds
        default:
            return "hsl(0, 0.00%, 100.00%)";//unknown weather condition
    }
}

function getTempColor(temp){
    
    temp = ((temp - 273.15) * (9/5) + 32).toFixed(1); //converts temperature from Kelvin to Farenheit and rounds to 1 decimal place

    switch(true){
        case (temp < 0):
            return "hsl(240, 100%, 50%)"; //very cold
        case (temp <= 32 && temp >= 0):
            return "hsl(194, 81.00%, 50.60%)"; //cold
        case (temp > 32 && temp <= 60):
            return "hsl(201, 64.00%, 49.00%)"; //cool
        case (temp > 60 && temp <= 80):
            return "hsl(50, 100%, 50%)"; //warm
        case (temp > 80 && temp <= 100):
            return "hsl(38, 100.00%, 50.00%)"; //hot
        case (temp > 100):
            return "hsl(18, 100.00%, 50.00%)"; //very hot
    }
}

function displayError(text){
    const errorDisplay = document.createElement("p"); //creates a "paragraph" element in the HTML file
    errorDisplay.textContent = text; //sets the text content of the paragraph element to the error message
    errorDisplay.classList.add("errorDisplay"); //adds the "error" class from the CSS file to the paragraph element

    card.textContent = "";
    card.style.display = "flex";

    card.appendChild(errorDisplay); //appends the error message to the card element in the HTML file
}
