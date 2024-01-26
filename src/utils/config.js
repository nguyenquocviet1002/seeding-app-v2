export const tokenName = 'token-seeding';

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

export function removeLastItem(data) {
  try {
    const dataFinal = [];
    for (let i = 0; i < data.length - 1; i++) {
      dataFinal.push(data[i]);
    }
    return dataFinal;
  } catch (error) {
    return [];
  }
}
