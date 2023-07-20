function createUser() {
  fetch("http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicId: "lethalspoons",
      password: "youCant%know#It"
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
}
