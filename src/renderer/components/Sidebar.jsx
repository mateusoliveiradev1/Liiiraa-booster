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
import logo from '../assets/logo.png';
import { TbBrandFortnite } from 'react-icons/tb';
import { GiPistolGun } from 'react-icons/gi';

function Sidebar({ activeSection, onSelect }) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed((c) => !c);
  const sectionGroups = [
    {
      title: 'sidebar.group_system',
      items: [
        { key: 'Dashboard', icon: <MdDashboard />, tKey: 'sidebar.dashboard' },
        { key: 'System', icon: <FaShieldAlt />, tKey: 'sidebar.system' }
      ]
    },
    {
      title: 'sidebar.group_hardware',
      items: [
        { key: 'CPU', icon: <FaMicrochip />, tKey: 'sidebar.cpu' },
        { key: 'GPU', icon: <BsGpuCard />, tKey: 'sidebar.gpu' }
      ]
    },
    {
      title: 'sidebar.group_games',
      items: [
        { key: 'Games', icon: <FaBullseye />, tKey: 'sidebar.games' }
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
      className={`${collapsed ? 'w-12' : 'w-48'} md:w-48 border-r border-border dark:border-border-dark bg-gradient-to-b from-surface to-muted dark:from-surface-dark dark:to-muted-dark pt-8 px-4 pb-4 space-y-2 transition-all duration-300 overflow-hidden`}
    >
      <button
        onClick={toggleCollapsed}
        aria-label="Toggle sidebar"
        className="md:hidden mb-2 p-2"
      >
        &#9776;
      </button>
      <img
        src={logo}
        alt="Liiiraa Booster logo"
        className="h-24 w-24 mx-auto animate-bounce hover:animate-spin transition-transform"
      />
      <img src={logo} alt="Liiiraa Booster logo" className="h-12 w-12 mx-auto" />
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
              className={`flex items-center w-full text-left px-3 py-2 rounded transition ${
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

export default React.memo(Sidebar);
