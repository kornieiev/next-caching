import { cache } from "react"; // функция для предотвращения дублирования одинаковых запросов данных. предотвращает повторные обращения к БД, если она не обновлена

import { unstable_cache as nextCache } from "next/cache"; // функция позволяет сделать данные, которые в нее оборачиваются доступными к кешированию для NextJS - возвращает промис!!!

import sql from "better-sqlite3";

const db = new sql("messages.db");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY, 
      text TEXT
    )`);
}

initDb();

export function addMessage(message) {
  db.prepare("INSERT INTO messages (text) VALUES (?)").run(message);
}

// нужно обернуть в cache() функцию обращения в БД. Теперь все запросы будут агресивно кешированы
// после этого в компоненте, где используются эти данные нужно их обновить. Для этого можно использовать
// revalidatePath('/messages') - нужно указать в том месте, где экшен, который меняет данные, сразу после такого экшена
// или, как альтернатива можно использовать:
// revalidateTag('msg') - нужно указать в том месте, где экшен, который меняет данные, сразу после такого экшена
// таким образом все компоненты, которые получают такие данные будут обновлены
export const getMessages = nextCache(
  cache(function getMessages() {
    console.log("Fetching messages from db");
    return db.prepare("SELECT * FROM messages").all();
  }),
  ["messages"], // второй аргумент функции nextCache, массив, в котором нужно указать ключи кеша, для внутренней идентификации кешированных данных
  // третий аргумент функции nextCache, объект конфигурации, который позволяет настроить два разных параметра
  {
    revalidate: 5, // устанавливает промежуток времени обновления кеш (в секундах)
    tags: ["msg"], // устанавливает связь с тегом указанным в revalidateTag("msg"). То есть и там и там надо указать одинаковое имя такого тега
  }
);
