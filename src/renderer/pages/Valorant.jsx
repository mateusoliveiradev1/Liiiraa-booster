import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { SiValorant } from 'react-icons/si';

export default function Valorant({ onRun }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-2">{t('messages.valorant_desc')}</p>
      <button className="btn-accent" onClick={onRun}>
        <SiValorant className="inline mr-1" />
        {t('buttons.optimize_valorant')}
      </button>
    </div>
  );
}
