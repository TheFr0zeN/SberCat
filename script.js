const API_URL = "https://sb-cats.herokuapp.com";
const API_VERSION = 2;
const getBaseUrl = function () {
	return `${API_URL}/api/${API_VERSION}/${user}`;
}


let user = localStorage.getItem("catUser");
if (!user) {
	user = prompt("Представьтесь, пожалуйста")
	localStorage.setItem("catUser", user);
}

const popupBlock = document.querySelector(".popup-wrapper");

popupBlock.querySelector(".popup__close").addEventListener("click", function () {
	popupBlock.classList.remove("active");
});

document.querySelector("#add").addEventListener("click", function (e) {
	e.preventDefault();
	popupBlock.classList.add("active");
});

const addForm = document.forms.addForm;
/*
	{
		id, name, rate, age, 
		img_link, description, 
		favourite
	}
*/

const createCard = function (cat, parent) {
	const card = document.createElement("div");
	card.className = "card";

	const img = document.createElement("div");
	img.className = "card-pic";
	if (cat.img_link) {
		img.style.backgroundImage = `url(${cat.img_link})`;
	} else {
		img.style.backgroundImage = "url(img/cat.png)";
		img.style.backgroundSize = "contain";
		img.style.backgroundColor = "transparent";
	}

	const name = document.createElement("h3");
	name.innerText = cat.name;

	let like = "";
	like.onclick = () => {
		//....
		// cat.id
	}

	const del = document.createElement("button");
	del.innerText = "delete";
	del.id = cat.id;
	del.addEventListener("click", function (e) {
		let id = e.target.id;

		console.log(e)

		if (window.confirm("Delete cat?")) {
			deleteCat(id);
		}
	});

	card.append(img, name, del);
	parent.append(card);
}

// Получение котов
const getCats = async function () {
	const result = await fetch(`${getBaseUrl()}/show`)
		.then(res => res.json())
	if (result.message === "ok") {
		return result.data
	} else {
		return []
	}
}

// Получение кота
const getCat = async function (id) {
	const result = await fetch(`${getBaseUrl()}/show?id=${id}`)
		.then(res => res.json())
	if (result.message === "ok") {
		return result.data[0]
	} else {
		return undefined
	}
}

const drawCats = function (data) {

	const container = document.querySelector("main");

	container.replaceChildren();

	data.forEach(function (el) {
		createCard(el, container);
	})
}


// const cat = {
// 	id: 6,
// 	name: "Василий",
// 	img_link: "https://documents.infourok.ru/b15649ae-78ff-40d2-810f-49e07e465ac8/0/image001.png"
// }

// JSON.stringify(obj) - сделает из объекта строку
// JSON.parse(str) - сделает из строки объект (если внутри строки объек)

const addCat = function (cat) {
	fetch(`${getBaseUrl()}/add`, {
		method: "POST",
		headers: { // обязательно для POST/PUT/PATCH
			"Content-Type": "application/json"
		},
		body: JSON.stringify(cat) // обязательно для POST/PUT/PATCH
	})
		.then(res => res.json())
		.then(async data => {
			console.log(data);
			if (data.message === "ok") {
				addForm.reset();
				popupBlock.classList.remove("active");

				drawCats(await getCats())
			}
		})
}

const deleteCat = async function (id) {
	fetch(`${getBaseUrl()}/delete/${id}`, {
		method: "DELETE"
	})
		.then(res => res.json())
		.then(async data => {
			if (data.message === "ok") {
				drawCats(await getCats())
			}
		})
}


addForm.addEventListener("submit", function (e) {
	e.preventDefault();
	let body = {};

	for (let i = 0; i < addForm.elements.length; i++) {
		let el = addForm.elements[i];
		console.log(el);
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}

	console.log(body);
	addCat(body);
});


// ready
document.addEventListener("DOMContentLoaded", async function (event) {
	drawCats(await getCats())
});