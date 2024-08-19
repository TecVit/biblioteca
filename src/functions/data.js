function subtrairDatas(data1, data2) {
    // Função para converter string "dd/mm/yyyy" para objeto Date
    function parseDate(dateString) {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day); // Meses começam do zero em JavaScript
    }
  
    // Convertendo as datas para objetos Date
    const date1 = parseDate(data1);
    const date2 = parseDate(data2);
  
    // Calculando a diferença em milissegundos
    const diffInMs = date2 - date1;
  
    // Convertendo a diferença para dias
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
    return diffInDays;
}

export { subtrairDatas };