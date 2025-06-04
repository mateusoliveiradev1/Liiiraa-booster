import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function Optimize({ onRun }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-2">{t('messages.optimize_desc')}</p>
      <button className="btn-primary" onClick={onRun}>
        {t('buttons.run_optimize')}
      </button>
    </div>
  );
}
