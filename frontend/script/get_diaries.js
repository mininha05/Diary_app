
const section = document.querySelector("#articles");
async function fetching_data() {
    // 2. 로컬 서버에서 데이터를 가져오고나면, DOM을 업데이틀하는 함수를 시행(=호출)
    await fetch('http://localhost:3000/posts')
        .then(response => response.json())
        .then(json => updateDOM(json))
}

function noContents() {}

fetching_data();// 1.데이터를 서버로 부터 가져오는 명령 실행

function updateDOM(diaries) {
    let template = "";
    document.querySelector("#count").innerText = diaries.length;
    for (let dairy of diaries) {
        template += `
        <article class = "d-flex my-1 bg-white justify-center items-center border-1 radius-1">
            <div class = "flex-1 text-center">
            <div class = "roundids-box py-1 mx-1 radius-1 d-flex column text-white">
            <span class="material-symbols-outlined font-big">${dairy.weather}</span>
            <span class = "font-small"> ${dairy.date}</sapn>
            </div>
            </div>
            <div class = "flex-3">
                ${dairy.title}
            </div>
            <div class = "flex-1">
                <button type="button" class = "btn " onclick="show_diary('${dairy.id}')">
                읽기    
                </button>    
            </div>
        </article>
`;
}
    section.innerHTML = template;
}
async function show_diary (id) {
    const reponse = await fetch(`http://localhost:3000/posts/${id}`)
    .then(reponse => reponse.json())
    .then(diary => updateModal(diary))
}

function updateModal(date) {
    let template = "";
    template +=`
    <div id="modal" class="container">
        <div class="content">
            <form id="update_form" >
                <fieldset>
                    <legend>일기</legend>
                    <div class="d-flex justify-between">
                        <div class="d-flex flex-1">
                            <label for="date_time" class=" flex-1 justify-between">일시</label>
                            <input type="date" name="date_time" class="flex-1"  id="date_time" value= "${date.date}">
                        </div>
                        <div class="flex-1">
                                <input type="radio" name="weather" ${date.weather == "sunny" ? "checked" : null} id="weather_sunny" value="sunny">
                                <label for="weather_sunny">
                                    맑음
                                </label>
                                <input type="radio" name="weather"  ${date.weather == "foggy" ? "checked" : null}id="weather_foggy" value="foggy">
                                <label for="weather_foggy">
                                    안개
                                </label>
                                <input type="radio" name="weather" ${date.weather == "rainy" ? "checked" : null} id="weather_rainy" value="rainy">
                                <label for="weather_rainy">
                                    비옴
                                </label>
                                <input type="radio" name="weather" ${date.weather == "cloud" ? "checked" : null} id="weather_cloud" value="cloud">
                                <label for="weather_cloud">
                                    흐림
                                </label>
                        </div>
                    </div>
                    <div class="d-flex">
                        <label for="title" class="flex-1" >제목</label>
                        <input type="text" name="title" class="flex-3" value= "${date.title}" id="title">
                    </div>
                    <div class="d-flex">
                        <label for="body" class="flex-1">내용</label>
                        <textarea rows="10" cols="20" class="flex-3"  id="body"> ${date.contnet}</textarea>
                    </div>
                    <div class="flex-end gap-1 d-flex">
                        <input type="submit" class="btn" value="수정" onclick="modify()">
                        <input type="button" class="btn" value="삭제" onclick= "remove()">
                        <input type="button" class="btn" value="닫기" onclick= "close_modal()">
                    </div>
                </fieldset>
            </form>
        </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", template);
    document.body.style.overflow = "hidden";
    // console.log(diary.title, diary.weather, diary.date, diary.content);
}

async function remove(id){
  // console.log(id);
  let select = confirm("정말로 삭제하시겠습니까?");
  if (select) {
    await fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE"
    });
    location.reload()
  } else {
    alert("삭제를 취소했습니다.")
  }
}

function close_modal() {
    location.reload();
}
function modify(){
    const updateForm = document.querySelector("#update_form");
    const diary_Id = updateForm.dataset.id;

    updateForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const modify_datetime = updateForm.querySelector("#date_time");
        const modify_weather = updateForm.querySelector("#weather");
        const weather = updateForm.querySelectorAll("[name=weather]");
        const new_weather = Array.from(weather);
        const isTrue = new_weather.filter(n=>n.checked == true);
        const modify_title = updateForm.querySelector("#title");
        const modify_body = updateForm.querySelector("#content");
        console.log(modify_weather);
        
        const modified = {
            title: modify_title.value,
            date: modify_datetime.value,
            weather: new_weather[1].value,
            content: modify_body.value
        }
        update_diary(modified, diary_Id)
    });
}

async function update_diary(data={}, id) {
    await fetch(`http://localhost:3000/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
    })
}