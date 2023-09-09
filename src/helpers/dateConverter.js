function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDateLocal(date) {
  date = new Date(date);
  return (
    [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join(
      '-'
    ) +
    ' ' +
    [
      padTo2Digits(date.getHours() - 7),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

module.exports = {
  formatDateLocal,
};
