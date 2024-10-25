// 위치 정보 가져오기
if (navigator.geolocation) {
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
}

function error() {
  alert("위치 정보를 가져올 수 없어요");
}

// 현재 위치의 도시 이름을 화면에 출력하는 함수
function getCityName(latitude, longitude) {
  const apiKey = config.apiKey;
  console.log(apiKey);
  // fetch 요청을 보낼 주소
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  console.log("url", url);

  // url 을 기반으로 API 에 데이터를 받아오도록 요청
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // data 가 true 면
      console.log("data", data);
      if (data.status === "OK") {
        const address = data.results[7].formatted_address; // 대한민국 경기도 고양시
        document.getElementById("city").innerText = `${address}`; // 위치를 화면에 표시
      }
    })
    .catch((error) => console.log("에러: ", error));
}
