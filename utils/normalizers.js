import { dataParaTela } from "./dateFormatter";

export function normalizarAnimal(animal) {
  return {
    ...animal,
    id: String(animal.id),
    idade: animal.idade == null ? "" : String(animal.idade),
    raca: animal.raca || "",
    telefone: animal.telefone || "",
  };
}

export function normalizarServico(servico) {
  return {
    ...servico,
    id: String(servico.id),
    animalId: String(servico.animal_id ?? servico.animalId ?? ""),
    data: dataParaTela(servico.data),
    valor: String(servico.valor ?? ""),
    status: servico.status || "Agendado",
    observacoes: servico.observacoes || "",
  };
}
