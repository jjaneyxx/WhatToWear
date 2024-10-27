// DOM 이 완전히 로드된 후에 실행되는 자바스크립트 코드
document.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {
    // 위치 정보 가져오기
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true, // 가능한 한 정확한 위치 정보 가져오기
      timeout: 5000, // 위치 정보를 가져오는데 최대 5초 기다림
      maximumAge: 0, // 캐시된 위치 정보를 사용하지 않고 항상 새로운 위치 정보 가져오기
    });
  } else {
    // Geolocation API 를 유저의 브라우저가 지원하지 않을 경우
    alert("Geolocation API 를 지원하지 않는 브라우저예요");
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getCityName(latitude, longitude);
    getWeather(latitude, longitude);
  }

  function error() {
    alert("위치 정보를 가져올 수 없어요");
  }

  // 현재 위치의 도시 이름을 화면에 출력하는 함수
  async function getCityName(latitude, longitude) {
    const apiKey = config.apiKey;

    // fetch 요청을 보낼 주소
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    console.log(url);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const address = data.results[7].formatted_address; // 대한민국 경기도 고양시
        document.getElementById("city").innerText = `${address}`; // 위치를 화면에 표시
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async function getWeather(latitude, longitude) {
    const weatherApiKey = config.weatherApiKey;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=kr&units=metric&appid=${weatherApiKey}`;
    try {
      const response = await fetch(url); // promise 객체를 우선 반환, fullfilled 되면 response 객체를 전달
      const data = await response.json(); // json 형식으로 변환
      console.log(data);

      const currentTemp = data.main.temp; // 현재 기온
      document.getElementById("currentTemp").innerText = `${currentTemp}℃`; // 기온을 화면에 표시

      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      document.getElementById("weatherIcon").src = iconUrl;

      const currentWeather = data.weather[0].description; // 날씨 상태, 객체 하나로 이루어진 배열
      document.getElementById("currentWeather").innerText = `${currentWeather}`; // 기온을 화면에 표시
    } catch (error) {
      console.log("Error: ", error);
    }
  }
});
