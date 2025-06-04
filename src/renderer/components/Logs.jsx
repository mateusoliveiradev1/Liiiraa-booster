import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import '../i18n';

export default function Logs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const fetchLogs = () => {
    if (!window.api?.getLogs) return;
    return window.api
      .getLogs()
      .then((data) => {
        setLogs(data);
        setError(null);
      })
      .catch(() => {
        setError(t('messages.load_logs_failed'));
      });
  };

  const handleClearLogs = () => {
    if (!window.api?.clearLogs) return;
    window.api
      .clearLogs()
      .then(() => {
        toast.success(t('messages.logs_cleared'));
        fetchLogs();
      })
      .catch(() => {
        toast.error(t('messages.clear_logs_failed'));
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <button className="mb-4 btn-primary" onClick={handleClearLogs}>
        {t('buttons.clear_logs')}
      </button>
      {logs.length ? (
        logs.map(({ file, lines }) => (
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
        ))
      ) : (
        <p>{t('messages.no_logs')}</p>
      )}
    </div>
  );
}
