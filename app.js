
fetch("reglas.json")
  .then(r => r.json())
  .then(data => {
    console.log("JSON OK", data);
  })
  .catch(e => {
    console.log("ERROR JSON", e);
  })
