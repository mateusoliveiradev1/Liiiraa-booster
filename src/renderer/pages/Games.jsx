import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { SiPubg, SiCounterstrike, SiValorant, SiActivision, SiEpicgames } from 'react-icons/si';
import { TbBrandFortnite } from 'react-icons/tb';

export default function Games({ onSelect }) {
  const { t } = useTranslation();
  return (
    <div className="space-x-2">
      <button className="btn-accent" onClick={() => onSelect('PUBG')}>
        <SiPubg className="inline mr-1" />
        {t('sidebar.pubg')}
      </button>
      <button className="btn-accent" onClick={() => onSelect('CS2')}>
        <SiCounterstrike className="inline mr-1" />
        {t('sidebar.cs2')}
      </button>
      <button className="btn-accent" onClick={() => onSelect('Fortnite')}>
        <TbBrandFortnite className="inline mr-1" />
        {t('sidebar.fortnite')}
      </button>
      <button className="btn-accent" onClick={() => onSelect('Warzone')}>
        <SiActivision className="inline mr-1" />
        {t('sidebar.warzone')}
      </button>
      <button className="btn-accent" onClick={() => onSelect('Valorant')}>
        <SiValorant className="inline mr-1" />
        {t('sidebar.valorant')}
      </button>
    </div>
  );
}
