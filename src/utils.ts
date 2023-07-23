export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
