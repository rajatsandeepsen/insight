export function base64ToFile(base64Data:string, fileName:string) {
    const binaryData = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
  
    const blob = new Blob([uint8Array], { type: 'audio/ogg' });
    return new File([blob], fileName, { type: 'audio/ogg' });
  }