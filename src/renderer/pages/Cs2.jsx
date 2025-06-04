import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { SiCounterstrike } from 'react-icons/si';

export default function Cs2({ onRun }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-2">{t('messages.cs2_desc')}</p>
      <button className="btn-accent" onClick={onRun}>
        <SiCounterstrike className="inline mr-1" />
        {t('buttons.optimize_cs2')}
      </button>
    </div>
  );
}
