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

      const { outfit, outfitInfo } = getClothes(currentTemp);
      document.getElementById("outfit").innerText = `${outfit} 를 추천해요`; // 추천 옷차림을 화면에 표시
      document.getElementById("outfitInfo").innerText = `${outfitInfo}`;

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

function getClothes(temp) {
  console.log("getClothes() 실행", temp);
  switch (true) {
    case temp <= 4:
      return { outfit: "롱패딩, 두꺼운 코트, 기모 청바지, 목도리", outfitInfo: "추운 날씨에 적합한 방한용 의상" };
    case 4 < temp && temp <= 8:
      return { outfit: "울 코트, 가죽 자켓, 니트, 레깅스, 후드티", outfitInfo: "초겨울 느낌의 따뜻한 의상과 후드티" };
    case 8 < temp && temp <= 11:
      return { outfit: "트렌치코트, 데님 재킷, 니트, 와이드 팬츠, 후드집업", outfitInfo: "가을/봄에 적합한 캐주얼 스타일" };
    case 11 < temp && temp <= 16:
      return { outfit: "자켓, 가디건과 셔츠, 청바지, 후드티", outfitInfo: "선선한 날씨에 어울리는 가벼운 아우터와 후드티" };
    case 16 < temp && temp <= 19:
      return { outfit: "맨투맨, 얇은 니트, 면바지, 후드집업", outfitInfo: "편안하고 캐주얼한 초가을 스타일" };
    case 19 < temp && temp <= 22:
      return { outfit: "얇은 가디건, 반팔 티셔츠, 슬랙스", outfitInfo: "봄/가을에 어울리는 간편한 캐주얼 스타일" };
    case 22 < temp && temp <= 27:
      return { outfit: "반팔, 반바지, 린넨 팬츠", outfitInfo: "여름 초입에 적합한 가벼운 옷차림" };
    case 27 < temp:
      return { outfit: "민소매, 원피스", outfitInfo: "무더운 여름 날씨에 적합한 시원한 의상" };
  }
}
