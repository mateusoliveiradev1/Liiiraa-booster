import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { SiActivision } from 'react-icons/si';

export default function Warzone({ onRun }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-2">{t('messages.warzone_desc')}</p>
      <button className="btn-accent" onClick={onRun}>
        <SiActivision className="inline mr-1" />
        {t('buttons.optimize_warzone')}
      </button>
    </div>
  );
}
