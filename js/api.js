const SERVER_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
};

// Получить данные с сервера
export const getData = () => fetch(
  SERVER_URL + Route.GET_DATA)
  .then((response) => response.json())
  .catch(() => {
    throw new Error(ErrorText.GET_DATA);
  }
  );

// Отправить данные на сервер
export const sendData = (formData) => fetch(
  SERVER_URL + Route.SEND_DATA,
  {
    method: 'POST',
    body: formData,
  },
).then((response) => {
  if (!response.ok) {
    throw new Error();
  }
})
  .catch(() => {
    throw new Error(ErrorText.SEND_DATA);
  });
