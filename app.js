const weatherapi = {
  key: "92102dde7079adbb2da6c19f5391399a",
  baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

const txtinput = document.getElementById("input-box");
const btnWeather = document.getElementById("button");
const divWeatherbody = document.getElementById("weather-body");
const divErrorMessage = document.getElementById("error-message");
const hCity = document.getElementById("city");
const pDate = document.getElementById("date");
const hTemp = document.getElementById("temp");
const pMinMax = document.getElementById("min-max");
const pWeather = document.getElementById("weather");
const pHumidity = document.getElementById("humidity");
const pWind = document.getElementById("wind");
const pPressure = document.getElementById("pressure");

async function getLocation() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const response = await fetch(
        `${weatherapi.baseUrl}?lat=${lat}&lon=${lon}&appid=${weatherapi.key}&units=metric`
      );
      const geodata = await response.json();
      showWeatherReport(geodata);
      divWeatherbody.classList.remove("d-none");
      divErrorMessage.classList.add("d-none");
    },
    (error) => {
      divWeatherbody.classList.add("d-none");
      divErrorMessage.classList.remove("d-none");
      clearWeatherDisplay();
    }
  );
}

txtinput.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    await getWeatherReport(event.target.value);
  }
});

btnWeather.addEventListener("click", async () => {
  await getWeatherReport(txtinput.value);
});

async function getWeatherReport(city) {
  try {
    const response = await fetch(
      `${weatherapi.baseUrl}?q=${city}&appid=${weatherapi.key}&units=metric`
    );
    if (response.status !== 200) {
      throw new Error(" City Not Found ❌ !");
    }
    const data = await response.json();
    showWeatherReport(data);
    divWeatherbody.classList.remove("d-none");
    divErrorMessage.classList.add("d-none");
  } catch (error) {
    divWeatherbody.classList.add("d-none");
    divErrorMessage.classList.remove("d-none");
    clearWeatherDisplay();
  }
}

function showWeatherReport(weather) {
  hCity.innerText = `${weather.name},${weather.sys.country}`;
  pDate.innerText = formatDate(new Date());
  hTemp.innerHTML = `${Math.round(weather.main.temp)}&deg;C`;
  pMinMax.innerHTML = `${Math.floor(
    weather.main.temp_min
  )}&deg; C (min) / ${Math.ceil(weather.main.temp_max)}&deg; C (max)`;
  pWeather.innerText = `${weather.weather[0].main}`;
  pHumidity.innerText = `${weather.main.humidity}`;
  pWind.innerText = `${weather.wind.speed} Kmph`;
  pPressure.innerText = `${weather.main.pressure} hPa`;
  updateBackground(weather.weather[0].main);
}

function formatDate(date) {
  const obj = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  return date.toLocaleDateString(undefined, obj);
}

function updateBackground(weatherType) {
  const backgrounds = {
    Clear: "Media/Images/clear.jpg",
    Clouds: "Media/Images/cloudes.jpg",
    Haze: "Media/Images/cloudes.jpg",
    Rain: "Media/Images/rain.jpg",
    Thunderstorm: "Media/Images/thunder.jpg",
    Sunny: "Media/Images/sunny.jpeg",
    Snow: "Media/Images/snow.jpg",
    Spring: "Media/Images/spring.jpg",
  };

  document.body.style.backgroundImage = `url(${
    backgrounds[weatherType] || "Media/Images/clear.jpg"
  })`;
}

function clearWeatherDisplay() {
  hCity.innerText = "";
  pDate.innerText = "";
  hTemp.innerText = "";
  pPressure.innerText = "";
  pMinMax.innerText = "";
  pWeather.innerText = "";
  pHumidity.innerText = "";
  pWind.innerText = "";
  // document.body.style.backgroundImage = url("/Media/Images/clear.jpg");
}
