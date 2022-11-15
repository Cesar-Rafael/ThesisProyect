function encryptCertificate(certificate) {
  // Obtener el identificador del estudiante
  const idStudent = certificate.idStudent

  // Generar una llave para encriptar el certificado
  const certificateEncriptionKey = CryptoJS.SHA512(idStudent)

  // Convertir el certificado a texto plano
  const contentToEncrypt = objectToText(certificate) 

  // Se define una variable que contendrá el certificado encriptado
  let encryptedCertificate = '' 

  // Se obtiene la cantidad de bloques del texto plano
  const totalBlocks = ceil(contentToEncrypt.lenght / 16)

  // Se itera por cada bloque
  for (let i = 0; i < totalBlocks; i++) {
    // Se obtiene la el bloque del contenido
    const blockContent = getBlock(i, contentToEncrypt)

    // En la primera iteración, el contenido es el del texto plano, pero se actualiza
    let currentBlockContent = blockContent

    // Se realiza 14 rounds cuando se tiene AES - 256 bits.
    for (let j = 0; j < 14; j++) {
      // Se obtiene la el bloque de la llave
      const blockKey = getBlock(j, certificateEncriptionKey)

      // Se realiza un XOR entre el bloque de contenido y llave
      const resultRoundKey = addRoundKey(currentBlockContent, blockKey)

      // Se realiza un cambio de filas
      const resultShiftRows = shiftRows(resultRoundKey)
      
      // Se realiza una combinación de columnas y se actualiza el bloque de contenido
      currentBlockContent = mixColumns(resultShiftRows) 
    }

    // Se concatena el bloque encriptado
    encryptedCertificate += currentBlockContent
  }

  // Se retorna el certificado encriptado
  return encryptedCertificate
}