export function removeFirstItem(data) {
  try {
    const dataFinal = [];
    for (let i = 1; i < data.length; i++) {
      dataFinal.push(data[i]);
    }
    return dataFinal;
  } catch (error) {
    return [];
  }
}
