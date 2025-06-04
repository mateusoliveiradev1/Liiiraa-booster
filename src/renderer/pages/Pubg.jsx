import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { SiPubg } from 'react-icons/si';

export default function Pubg({ onRun }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-2">{t('messages.pubg_desc')}</p>
      <button className="btn-accent" onClick={onRun}>
        <SiPubg className="inline mr-1" />
        {t('buttons.optimize_pubg')}
      </button>
    </div>
  );
}
