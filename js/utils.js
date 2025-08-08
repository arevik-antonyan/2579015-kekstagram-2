/* Модуль для вспомогательных функций */

// Проверить есть ли дубликаты
const hasDuplicates = (items) => {
  const uniqueItems = new Set(items);
  return uniqueItems.size !== items.length;
};

export {hasDuplicates};
