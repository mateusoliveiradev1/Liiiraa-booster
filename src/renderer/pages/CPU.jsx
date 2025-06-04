import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { SiAmd, SiIntel } from 'react-icons/si';

export default function CPU({ onAmd, onIntel, onAmdRestore, onIntelRestore }) {
  const { t } = useTranslation();
  return (
    <div className="space-x-2">
      <button className="btn-amd" onClick={onAmd}>
        <SiAmd className="inline mr-1" />
        {t('buttons.optimize_amd_cpu')}
      </button>
      <button className="btn-amd" onClick={onAmdRestore}>
        <SiAmd className="inline mr-1" />
        {t('buttons.restore_amd_cpu')}
      </button>
      <button className="btn-intel" onClick={onIntel}>
        <SiIntel className="inline mr-1" />
        {t('buttons.optimize_intel_cpu')}
      </button>
      <button className="btn-intel" onClick={onIntelRestore}>
        <SiIntel className="inline mr-1" />
        {t('buttons.restore_intel_cpu')}
      </button>
    </div>
  );
}
