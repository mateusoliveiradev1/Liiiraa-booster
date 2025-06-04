import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function History() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.api?.getLogs) return;
    window.api
      .getLogs()
      .then((data) => {
        setLogs(data);
        setError(null);
      })
      .catch(() => {
        setError(t('messages.load_logs_failed'));
      });
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!logs.length) {
    return <p>{t('messages.no_logs')}</p>;
  }

  return (
    <div>
      {logs.map(({ file, lines }) => (
        <div key={file} className="mb-4">
          <h3 className="font-semibold">{file}</h3>
          <ul className="ml-4 list-disc">
            {lines.map((line, idx) => (
              <li key={idx} className="font-mono whitespace-pre-wrap">
                {line}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
