import { useState } from "react";

export function useFormModal(aba, animais) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  const atualizarCampo = (campo, valor) => {
    setForm((anterior) => ({ ...anterior, [campo]: valor }));
  };

  function abrirCadastro() {
    setEditando(null);
    setForm(
      aba === "animais"
        ? {
            nome: "",
            especie: "Cachorro",
            raca: "",
            idade: "",
            tutor: "",
            telefone: "",
          }
        : {
            animalId: animais[0]?.id || "",
            tipo: "Banho",
            data: "",
            valor: "",
            status: "Agendado",
            observacoes: "",
          }
    );
    setModal(true);
  }

  function abrirEdicao(item) {
    setEditando(item.id);
    setForm({ ...item });
    setModal(true);
  }

  function fecharModal() {
    setModal(false);
    setEditando(null);
    setForm({});
  }

  return {
    modal,
    setModal,
    editando,
    form,
    atualizarCampo,
    abrirCadastro,
    abrirEdicao,
    fecharModal,
  };
}
