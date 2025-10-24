export const enderecoServidor = "http://localhost:3000";

export const listaCores = [
  "#000",
  "#111",
  "#222",
  "#333",
  "#444",
  "#555",
  "#666",
  "#777",
  "#888",
  "#999",
  "#fff",
  "#f8f8f8",
  "#e0e0e0",
  "#c0c0c0",
  "#a0a0a0",
  "#808080",
  "#606060",
  "#404040",
  "#008",
  "#00f",
  "#080",
  "#088",
  "#0f0",
  "#0f8",
  "#800",
  "#808",
  "#880",
  "#f00",
  "#f08",
  "#f80",
  "#f88",
  "#ff0",
  "#ff8",
  "#0ff",
  "#08f",
  "#80f",
  "#f0f",
  "#f0a",
  "#fa0",
  "#0fa",
  "#a0f",
  "#0af",
  "#af0",
  "#fa8",
  "#8af",
  "#a8f",
  "#8fa",
  "#41d3be",
  "#008080",
  "#e63946",
  "#f1faee",
  "#a8dadc",
  "#457b9d",
  "#1d3557",
  "#ffb703",
  "#fb8500",
];

export const listaIcones = [
  "restaurant",
  "directions-car",
  "school",
  "home",
  "sports-soccer",
  "shopping-cart",
  "pets",
  "favorite",
  "fitness-center",
  "wallet",
  "flight",
  "local-cafe",
  "local-bar",
  "local-hospital",
  "local-pharmacy",
  "local-gas-station",
  "local-movies",
  "local-offer",
  "local-parking",
  "local-pizza",
  "local-play",
  "local-shipping",
  "local-taxi",
  "work",
  "attach-money",
  "credit-card",
  "account-balance",
  "phone-android",
  "phone-iphone",
  "computer",
  "laptop",
  "headset",
  "music-note",
  "book",
  "cake",
  "beach-access",
  "directions-bus",
  "directions-bike",
  "directions-boat",
  "directions-railway",
  "directions-walk",
  "emoji-people",
  "emoji-events",
  "emoji-food-beverage",
  "emoji-nature",
  "emoji-objects",
  "emoji-symbols",
  "emoji-transportation",
  "fastfood",
  "local-dining",
  "local-drink",
  "local-florist",
  "local-grocery-store",
];

export const formatarDinheiro = (valor) => {
  valor = Number(valor)
  return valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
}


export const calcularDatasPeriodo = (periodo) => {
  const hoje = new Date(); //obtendo a data atual
  let dataInicio = new Date();
  let dataFim = new Date();

  switch (periodo) {
    case "esteMes": //de 1º ao último dia do mês atual
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      break;  

    case "mesPassado": //de 1º ao último dia do mês passado
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
      break;
    
      case "ultimos7": //últimos 7 dias
      dataInicio.setDate(hoje.getDate() - 6);
      dataFim = hoje;
      break;

    case "ultimos30": //últimos 30 dias
      dataInicio.setDate(hoje.getDate() - 29);
      dataFim = hoje;
      break;

    case "todos": //todas as datas
      dataInicio = new Date(2000, 1, 1);
      dataFim = new Date(2100, 12, 31);
      break;
  }

  dataInicio = dataInicio.toISOString().split("T")[0];
  dataFim = dataFim.toISOString().split("T")[0];

  return { dataInicio, dataFim };
}

export const formatarData = (data) => {
  const dataFormatada = new Date(data);
  return dataFormatada.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
