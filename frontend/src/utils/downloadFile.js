import { saveAs } from 'file-saver';

const getExtensionFromMime = (mimeType) => {
  const map = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-excel': 'xls',
    'text/csv': 'csv',
    'application/json': 'json',
    'text/plain': 'txt',
    'application/sql': 'sql',
    'application/x-sql': 'sql',
    'text/x-sql': 'sql',
    'application/zip': 'zip',
    'application/x-zip-compressed': 'zip',
  };
  return map[mimeType] || 'bin';
};

const getFilenameFromDisposition = (contentDisposition) => {
  if (!contentDisposition) return null;
  const match = contentDisposition.match(/filename="?([^"]+)"?/);
  return match ? match[1] : null;
};

export const downloadPDF = async (url, baseFilename = 'file', options = {}) => {
  try {
    const token = JSON.parse(sessionStorage.getItem('authentication'))?.access_token;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const contentType = response.headers.get('Content-Type');
    const extension = getExtensionFromMime(contentType);

    // Try to get filename from headers, fallback to generated name
    const contentDisposition = response.headers.get('Content-Disposition');
    const serverFilename = getFilenameFromDisposition(contentDisposition);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalFilename =
      serverFilename || `${baseFilename}_${timestamp}.${extension}`;

    saveAs(blob, finalFilename);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};