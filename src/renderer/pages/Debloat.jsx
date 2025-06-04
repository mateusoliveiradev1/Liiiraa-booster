import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function Debloat({ onFull, onLite, onRestore }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-2">{t('messages.debloat_desc')}</p>
      <div className="space-x-2">
        <button className="btn-warning" onClick={onFull}>
          {t('buttons.debloat_full')}
        </button>
        <button className="btn-warning" onClick={onLite}>
          {t('buttons.debloat_lite')}
        </button>
        <button className="btn-neutral" onClick={onRestore}>
          {t('buttons.debloat_restore')}
        </button>
      </div>
    </div>
  );
}
