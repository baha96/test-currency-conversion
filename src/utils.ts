export function formatDate(date: string | Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
