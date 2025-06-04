import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { SiNvidia, SiIntel, SiAmd } from 'react-icons/si';

export default function GPU({ onNvidia, onIntel, onAmd }) {
  const { t } = useTranslation();
  return (
    <div className="space-x-2">
      <button className="btn-nvidia" onClick={onNvidia}>
        <SiNvidia className="inline mr-1" />
        {t('buttons.optimize_nvidia_gpu')}
      </button>
      <button className="btn-intel" onClick={onIntel}>
        <SiIntel className="inline mr-1" />
        {t('buttons.optimize_intel_gpu')}
      </button>
      <button className="btn-amd" onClick={onAmd}>
        <SiAmd className="inline mr-1" />
        {t('buttons.optimize_amd_gpu')}
      </button>
    </div>
  );
}
