const API_BASE = '/api';

export async function createCertificate(data) {
  const response = await fetch(`${API_BASE}/certificates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Failed to generate certificate' }));
    throw new Error(err.detail || err.error || 'Failed to generate certificate');
  }

  return response.json();
}

export async function getCertificates({ query = '', status = '', skip = 0, limit = 100 } = {}) {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (status && status !== 'ALL') params.append('status', status);
  if (skip) params.append('skip', skip.toString());
  if (limit) params.append('limit', limit.toString());

  const response = await fetch(`${API_BASE}/certificates?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch certificates directory');
  }
  return response.json();
}

export async function getCertificate(certificateId) {
  const response = await fetch(`${API_BASE}/certificates/${encodeURIComponent(certificateId)}`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Certificate not found' }));
    throw new Error(err.detail || 'Certificate not found');
  }
  return response.json();
}

export async function verifyCertificate(certificateId) {
  const response = await fetch(`${API_BASE}/verify/${encodeURIComponent(certificateId)}`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Verification failed' }));
    throw new Error(err.message || 'Verification service failed');
  }
  return response.json();
}

export async function revokeCertificate(certificateId) {
  const response = await fetch(`${API_BASE}/certificates/${encodeURIComponent(certificateId)}/revoke`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Failed to revoke certificate' }));
    throw new Error(err.detail || 'Failed to revoke certificate');
  }
  return response.json();
}

export function getPdfDownloadUrl(certificateId) {
  return `${API_BASE}/certificates/${encodeURIComponent(certificateId)}/pdf`;
}

export async function triggerPdfDownload(certificateId, recipientName = 'Recipient') {
  const url = getPdfDownloadUrl(certificateId);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to download certificate PDF');
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;

  const safeName = (recipientName || 'Recipient').replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `CertiVault_${safeName}_${certificateId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
