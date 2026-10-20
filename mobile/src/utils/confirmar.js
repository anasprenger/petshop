import { Alert, Platform } from 'react-native';

// Pede confirmação antes de excluir. No celular usa o alerta nativo;
// no navegador (npx expo start --web) usa a caixa de confirmação do navegador.
export function confirmarExclusao({ titulo, mensagem, onConfirmar }) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) onConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: onConfirmar },
  ]);
}
