function textoValido(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

function camposFaltando(objeto, campos) {
  return campos.filter((campo) => !textoValido(objeto?.[campo]));
}

function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { textoValido, camposFaltando, escaparRegex };
