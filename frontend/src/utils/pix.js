/**
 * Gera payload PIX no formato EMV (QR Code dinâmico)
 * Seguindo especificação do Banco Central do Brasil
 */

function crc16(payload) {
  let crc = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function buildEMVField(id, value) {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

export function generatePixPayload(pixKey, amount, recipientName = 'Lucas e Jéssica', city = 'SAO PAULO') {
  // Normalizar dados
  const normalizedName = recipientName
    .substring(0, 25)
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos

  const normalizedCity = city
    .substring(0, 15)
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const amountStr = amount.toFixed(2);

  // Merchant Account Information (ID 26)
  const pixKeyField = buildEMVField('01', pixKey);
  const merchantAccount = buildEMVField('00', 'BR.GOV.BCB.PIX') + pixKeyField;

  // Additional Data Field Template (ID 62) com txid
  const txid = buildEMVField('05', '***');

  // Construir payload
  let payload = '';
  payload += buildEMVField('00', '01');           // Payload Format Indicator
  payload += buildEMVField('01', '12');           // Point of Initiation Method (12 = dinâmico)
  payload += buildEMVField('26', merchantAccount); // Merchant Account
  payload += buildEMVField('52', '0000');          // Merchant Category Code
  payload += buildEMVField('53', '986');           // Transaction Currency (986 = BRL)
  payload += buildEMVField('54', amountStr);       // Transaction Amount
  payload += buildEMVField('58', 'BR');            // Country Code
  payload += buildEMVField('59', normalizedName);  // Merchant Name
  payload += buildEMVField('60', normalizedCity);  // Merchant City
  payload += buildEMVField('62', txid);            // Additional Data Field Template

  // CRC16
  payload += '6304'; // CRC16 field ID
  const checksum = crc16(payload);
  payload += checksum;

  return payload;
}

export function formatPixKey(pixKey) {
  // Remove espaços e caracteres especiais
  return pixKey.replace(/[^a-zA-Z0-9@.\-_]/g, '');
}
