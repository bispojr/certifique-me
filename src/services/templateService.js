// Service para interpolação de texto_base com valores_dinamicos
module.exports = {
  /**
   * Interpola textoBase usando valoresDinamicos e, se não existir, o campo nome.
   * @param {string} textoBase
   * @param {object} valoresDinamicos
   * @param {string} [nome]
   * @returns {string}
   */
  interpolate(textoBase, valoresDinamicos, nome) {
    return textoBase.replace(/\$\{(\w+)\}/g, (match, chave) => {
      if (chave in valoresDinamicos) return valoresDinamicos[chave]
      if (chave === 'nome' && nome) return nome
      return match
    })
  },
}
