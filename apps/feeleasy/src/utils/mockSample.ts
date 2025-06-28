const payload = { name: 'mehrdad', lastName: 'dehghanzadeh', age: 30 }

fetch('http://localhost:8080/programers', {
  method: 'POST',
  body: JSON.stringify(payload)
})
  .then((res) => res.json())
  .then((data) => console.log(data))

fetch('http://localhost:8080/programers', { method: 'GET' })
  .then((res) => res.json())
  .then((data) => console.log(data))
