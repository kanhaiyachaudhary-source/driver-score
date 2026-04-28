'use client';

import { useEffect, useState } from 'react';

interface Sample {
  license_number: string;
  name?: string;
}

export default function HomePage() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [samples, setSamples] = useState<Sample[]>([]);
  const [showSamples, setShowSamples] = useState(false);

  useEffect(() => {
    fetch('/api/samples')
      .then(r => r.json())
      .then(setSamples)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !dob || !licenseNumber.trim()) {
      setError('Please fill in name, date of birth, and license number.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('dob', dob);
      fd.append('license_number', licenseNumber);
      fd.append('email', email);
      if (file) fd.append('document', file);

      const res = await fetch('/api/score', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Submission failed');
      }

      // Result is intentionally not shown to the user.
      // It's returned to the API caller (Power Automate) for forwarding to Guidewire.
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setName('');
    setDob('');
    setLicenseNumber('');
    setEmail('');
    setFile(null);
    setSubmitted(false);
    setError('');
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={navStyle}>
        <div style={logoStyle}>
          <div style={dotStyle} />
          PolicyCenter · Driver Scoring
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="/api/score" target="_blank" style={badgeStyle}>API docs</a>
          <a href="/api/samples" target="_blank" style={badgeStyle}>Sample licenses</a>
        </div>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px' }}>
        {submitted ? (
          <SuccessView onReset={reset} />
        ) : (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>
              Apply for a policy
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 28 }}>
              Submit your driving license details below. Our system will assess your risk profile and forward the result to PolicyCenter.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={cardStyle}>
                <div style={cardTitleStyle}>Personal details</div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Full name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Date of birth *</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>License number *</label>
                    <input
                      type="text"
                      placeholder="e.g. DL-MH-001-A1"
                      value={licenseNumber}
                      onChange={e => setLicenseNumber(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {samples.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setShowSamples(s => !s)}
                      style={{
                        background: 'none', border: 'none', color: 'var(--blue)',
                        fontSize: 12, cursor: 'pointer', padding: 0,
                      }}
                    >
                      {showSamples ? '− Hide' : '+ Show'} sample license numbers ({samples.length})
                    </button>
                    {showSamples && (
                      <div style={{
                        marginTop: 8, background: 'var(--surface2)',
                        borderRadius: 6, padding: 10, fontSize: 12,
                        maxHeight: 200, overflowY: 'auto',
                      }}>
                        {samples.map(s => (
                          <div key={s.license_number} style={{ marginBottom: 4 }}>
                            <button
                              type="button"
                              onClick={() => setLicenseNumber(s.license_number)}
                              style={{
                                background: 'none', border: 'none', color: 'var(--blue-text)',
                                cursor: 'pointer', padding: 0, fontSize: 12,
                                fontFamily: 'ui-monospace, monospace',
                              }}
                            >
                              {s.license_number}
                            </button>
                            {s.name && (
                              <span style={{ color: 'var(--text3)', marginLeft: 8 }}>· {s.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={cardStyle}>
                <div style={cardTitleStyle}>Driving license document</div>
                <UploadZone file={file} setFile={setFile} />
              </div>

              {error && (
                <div style={{
                  background: 'var(--red-bg)', border: '1px solid #f5c6c2',
                  color: 'var(--red-text)', padding: 12, borderRadius: 8,
                  marginBottom: 16, fontSize: 13,
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...primaryBtnStyle,
                  width: '100%',
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? 'wait' : 'pointer',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit application →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div style={{
      ...cardStyle, textAlign: 'center', padding: '40px 24px',
      borderColor: '#a8dfc8', background: '#fafffb',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'var(--green-bg)', margin: '0 auto 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em' }}>
        Submission successful
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.55 }}>
        Your application has been received and forwarded to PolicyCenter for processing.
        You will be notified about the policy decision shortly.
      </p>
      <button onClick={onReset} style={{ ...secondaryBtnStyle, padding: '10px 20px' }}>
        Submit another application
      </button>
    </div>
  );
}

function UploadZone({ file, setFile }: { file: File | null; setFile: (f: File | null) => void }) {
  const [drag, setDrag] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  return (
    <label
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      style={{
        display: 'block',
        border: `2px dashed ${drag ? 'var(--blue)' : 'var(--border2)'}`,
        background: drag ? 'var(--blue-bg)' : 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '32px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <div style={{
        width: 48, height: 48, borderRadius: 'var(--radius)',
        background: 'var(--blue-bg)', margin: '0 auto 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
        {file ? file.name : 'Click or drag to upload'}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text2)' }}>
        {file ? `${(file.size / 1024).toFixed(1)} KB · click to change` : 'JPG, PNG, PDF — max 10 MB'}
      </div>
    </label>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const navStyle: React.CSSProperties = {
  background: 'var(--surface)', borderBottom: '1px solid var(--border)',
  padding: '0 24px', display: 'flex', alignItems: 'center', height: 56,
  position: 'sticky', top: 0, zIndex: 10, boxShadow: 'var(--shadow)',
};
const logoStyle: React.CSSProperties = {
  fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
  letterSpacing: '-0.01em',
};
const dotStyle: React.CSSProperties = {
  width: 9, height: 9, borderRadius: '50%', background: 'var(--blue)',
};
const badgeStyle: React.CSSProperties = {
  fontSize: 12, padding: '4px 10px', borderRadius: 99,
  background: 'var(--surface2)', color: 'var(--text2)',
  border: '1px solid var(--border)', textDecoration: 'none',
};
const cardStyle: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: 20, marginBottom: 16,
  boxShadow: 'var(--shadow)',
};
const cardTitleStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 14,
};
const formGroupStyle: React.CSSProperties = { marginBottom: 14 };
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 500,
  color: 'var(--text2)', marginBottom: 5,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid var(--border2)',
  borderRadius: 'var(--radius-sm)', fontSize: 14, background: 'var(--surface)',
  color: 'var(--text)', outline: 'none',
};
const primaryBtnStyle: React.CSSProperties = {
  padding: '12px 22px', borderRadius: 'var(--radius-sm)',
  fontSize: 15, fontWeight: 500,
  background: 'var(--blue)', color: '#fff',
  border: '1px solid var(--blue)', transition: 'all 0.15s',
};
const secondaryBtnStyle: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 'var(--radius-sm)',
  fontSize: 14, fontWeight: 500,
  background: 'var(--surface)', color: 'var(--text)',
  border: '1px solid var(--border2)', transition: 'all 0.15s',
};
