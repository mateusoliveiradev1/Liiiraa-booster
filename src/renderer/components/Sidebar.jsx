import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { MdDashboard } from 'react-icons/md';
import {
  FaBolt,
  FaBroom,
  FaTrash,
  FaGamepad,
  FaMicrochip,
  FaBomb,
  FaPlug,
  FaTools,
  FaListAlt,
  FaCog,
  FaBullseye,
  FaShieldAlt
} from 'react-icons/fa';
import { BsGpuCard } from 'react-icons/bs';
import { SiAmd, SiIntel, SiNvidia, SiPubg, SiValorant } from 'react-icons/si';
import { TbBrandFortnite } from 'react-icons/tb';
import { GiPistolGun } from 'react-icons/gi';

export default function Sidebar({ activeSection, onSelect }) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed((c) => !c);
  const sectionGroups = [
    {
      title: 'sidebar.group_system',
      items: [
        { key: 'Dashboard', icon: <MdDashboard />, tKey: 'sidebar.dashboard' },
        { key: 'Optimize', icon: <FaBolt />, tKey: 'sidebar.optimize' },
        { key: 'Clean', icon: <FaBroom />, tKey: 'sidebar.clean' },
        { key: 'Debloat', icon: <FaTrash />, tKey: 'sidebar.debloat' },
        { key: 'Game Booster', icon: <FaGamepad />, tKey: 'sidebar.game_booster' },
        { key: 'Energy', icon: <FaPlug />, tKey: 'sidebar.energy' }
      ]
    },
    {
      title: 'sidebar.group_hardware',
      items: [
        { key: 'CPU AMD', icon: <FaMicrochip />, tKey: 'sidebar.cpu_amd' },
        { key: 'CPU Intel', icon: <FaMicrochip />, tKey: 'sidebar.cpu_intel' },
        { key: 'GPU Nvidia', icon: <BsGpuCard />, tKey: 'sidebar.gpu_nvidia' },
        { key: 'GPU AMD', icon: <BsGpuCard />, tKey: 'sidebar.gpu_amd' }
      ]
    },
    {
      title: 'sidebar.group_games',
      items: [
        { key: 'PUBG', icon: <SiPubg />, tKey: 'sidebar.pubg' },
        { key: 'CS2', icon: <GiPistolGun />, tKey: 'sidebar.cs2' },
        { key: 'Fortnite', icon: <TbBrandFortnite />, tKey: 'sidebar.fortnite' },
        { key: 'Warzone', icon: <FaBomb />, tKey: 'sidebar.warzone' },
        { key: 'Valorant', icon: <SiValorant />, tKey: 'sidebar.valorant' }
      ]
    },
    {
      title: 'sidebar.group_other',
      items: [
        { key: 'Advanced Tweaks', icon: <FaTools />, tKey: 'sidebar.advanced' },
        { key: 'Logs', icon: <FaListAlt />, tKey: 'sidebar.logs' },
        { key: 'Settings', icon: <FaCog />, tKey: 'sidebar.settings' }
      ]
    }
  ];

  return (
    <div
      data-testid="sidebar"
      className={`${collapsed ? 'w-12' : 'w-48'} md:w-48 border-r border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-4 space-y-2`}
    >
      <button
        onClick={toggleCollapsed}
        aria-label="Toggle sidebar"
        className="md:hidden mb-2 p-2"
      >
        &#9776;
      </button>
      {sectionGroups.map(({ title, items }, idx) => (
        <React.Fragment key={title}>
          {!collapsed && (
            <h3 className="mt-4 mb-1 text-xs font-semibold text-muted dark:text-muted-dark">
              {t(title)}
            </h3>
          )}
          {items.map(({ key, icon, tKey }) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex items-center w-full text-left px-3 py-2 rounded ${
                activeSection === key ? 'bg-primary text-white' : 'hover:bg-muted dark:hover:bg-muted-dark'
              }`}
            >
              <span className="mr-2">{icon}</span>
              <span className={collapsed ? 'hidden md:inline' : ''}>{t(tKey)}</span>
            </button>
          ))}
          {idx < sectionGroups.length - 1 && <hr className="my-2 border-border dark:border-border-dark" />}
        </React.Fragment>
      ))}
    </div>
  );
}
