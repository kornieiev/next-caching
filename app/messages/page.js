import { unstable_noStore } from "next/cache"; // функция позволяет убедится, что данные не кешированы

import Messages from "@/components/messages";
import { getMessages } from "@/lib/messages";

// Альтернативные варианты указания типа кеширования через зарезервированные слова.
// Таким образом во всех запросах этого файла будет действовать указанный тип, если иного не указать отдельно в параметрах запроса
// export const revalidate = 5; // указывает NextJS количество секунд, через которое обновлять данные
// export const dynamic = "force-dynamic"; // указывает NextJS всегда повторно получать новые данные
// export const dynamic = "force-static"; // указывает NextJS установить принудительное кеширование, что не будет позволять делать повторную загрузку
// export const fetchCache = "force-no-store"; //

export default async function MessagesPage() {
  // unstable_noStore(); // отключает кеширование всех запросов в этом компоненте

  //
  // const response = await fetch("http://localhost:8080/messages");
  // const messages = await response.json();
  //

  const messages = await getMessages();

  if (!messages || messages.length === 0) {
    return <p>No messages found</p>;
  }

  return <Messages messages={messages} />;
}
