export function validateImageHeader(bytes: Uint8Array): void {
  let width = 0; let height = 0;
  if (bytes.length >= 24 && [137, 80, 78, 71, 13, 10, 26, 10].every((value, i) => bytes[i] === value)) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); width = view.getUint32(16); height = view.getUint32(20);
  } else if (bytes[0] === 255 && bytes[1] === 216) {
    let index = 2;
    while (index + 8 < bytes.length) {
      if (bytes[index++] !== 255) break;
      while (bytes[index] === 255) index++;
      const marker = bytes[index++];
      if (marker === 217 || marker === 218) break;
      const length = bytes[index] * 256 + bytes[index + 1];
      if (length < 2 || index + length > bytes.length) break;
      if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker)) {
        height = bytes[index + 3] * 256 + bytes[index + 4]; width = bytes[index + 5] * 256 + bytes[index + 6]; break;
      }
      index += length;
    }
  }
  if (width < 32 || height < 32 || width > 2048 || height > 2048) throw new Error('Não conseguimos usar essa foto. Tire outra foto e tente novamente.');
}
export async function imageBase64(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 524288 || file.size === 0) throw new Error('Use uma foto JPG ou PNG menor que 512 KB.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  validateImageHeader(bytes); // Bound dimensions before allocating a browser raster.
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width < 32 || bitmap.height < 32 || bitmap.width > 2048 || bitmap.height > 2048) throw new Error('O tamanho da foto não é aceito. Tire outra foto e tente novamente.');
  } finally { bitmap.close(); }
  let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
