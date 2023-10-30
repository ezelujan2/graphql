let users = [
  { id: "1", name: "Ezequiel", email: "eze@example.com", age: 18 },
  { id: "2", name: "Candela", email: "candela@example.com" },
  { id: "3", name: "Emanuel", email: "emanuel@example.com", age: 22 },
];

let posts = [
  {
    id: "1",
    title: "Canciones",
    body: "Estas son las mejores canciones del mundo",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "La Musica",
    body: "Esta es la mejor musica del mundo",
    published: true,
    author: "2",
  },
  {
    id: "3",
    title: "La Comida",
    body: "Aqui les mostraremos algunas recetas para poder cocinar",
    published: true,
    author: "3",
  },
];

let comments = [
  { id: "11", text: "Este es el comentario 1", author: "1", post: "1" },
  { id: "12", text: "Este es el comentario 2", author: "2", post: "2" },
  { id: "13", text: "Este es el comentario 3", author: "3", post: "3" },
  { id: "14", text: "Este es el comentario 4 ", author: "1", post: "1" },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
