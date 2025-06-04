import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { SiEpicgames } from 'react-icons/si';

export default function Fortnite({ onRun }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-2">{t('messages.fortnite_desc')}</p>
      <button className="btn-accent" onClick={onRun}>
        <SiEpicgames className="inline mr-1" />
        {t('buttons.optimize_fortnite')}
      </button>
    </div>
  );
}
