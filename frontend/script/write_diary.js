// 폼 체크
// 체크 완료후엔 데이터를 모아서 > 서버로 application/json 으로 전송

const addForm = document.querySelector("#add_form");
const server_url = "http://localhost:3000/posts";
addForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const date = addForm.querySelector("#date_time");
    const weather = addForm.querySelectorAll("[name=weather]");
    const new_weather = Array.from(weather);
    const isTrue = new_weather.filter(n=>n.checked == true);
    const title = addForm.querySelector("#title");
    const body = addForm.querySelector("#body");

    const data = {
        title: title.value,
        date: date.value,
        weather: isTrue[0].value,
        content: body.value,
        print: function(){
            console.log(this.title)
        }
    }

    write_diary(server_url, data)
});

async function write_diary(url="", data={}) {
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: Json.stringfy(data)
    })
}