import React, { useState, useEffect, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBroom,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaNetworkWired,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { BsGpuCard } from "react-icons/bs";
import MetricsCard from "./components/MetricsCard.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Logs from "./components/Logs.jsx";
import Spinner from "./components/Spinner.jsx";

const Optimize = lazy(() => import("./pages/Optimize.jsx"));
const Debloat = lazy(() => import("./pages/Debloat.jsx"));
const CPU = lazy(() => import("./pages/CPU.jsx"));
const GPU = lazy(() => import("./pages/GPU.jsx"));
const Games = lazy(() => import("./pages/Games.jsx"));
const Pubg = lazy(() => import("./pages/Pubg.jsx"));
const Cs2 = lazy(() => import("./pages/Cs2.jsx"));
const Fortnite = lazy(() => import("./pages/Fortnite.jsx"));
const Warzone = lazy(() => import("./pages/Warzone.jsx"));
const Valorant = lazy(() => import("./pages/Valorant.jsx"));

const mockMetrics = {
  cpu: "35%",
  cpuPercent: 35,
  gpu: "45%",
  gpuPercent: 45,
  ram: "8 GB / 16 GB",
  ramPercent: 50,
  disk: "120 GB / 512 GB",
  diskPercent: 23,
  network: "200 Mbps",
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [metrics, setMetrics] = useState({
    cpu: mockMetrics.cpu,
    cpuPercent: mockMetrics.cpuPercent,
    gpu: "N/A",
    gpuPercent: null,
    gpuTemp: null,
    ram: mockMetrics.ram,
    ramPercent: mockMetrics.ramPercent,
    disk: mockMetrics.disk,
    diskPercent: mockMetrics.diskPercent,
    network: mockMetrics.network,
  });
  const [loading, setLoading] = useState(false);

  const [freedSpace, setFreedSpace] = useState("");

  const [username, setUsername] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored
      ? stored === "dark"
      : document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  useEffect(() => {
    if (activeSection === "Settings") {
      const stored = localStorage.getItem("theme");
      if (stored) {
        const isDark = stored === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        setDark(isDark);
      }
    }
  }, [activeSection]);

  useEffect(() => {
    if (window.api?.getUser) {
      window.api
        .getUser()
        .then((name) => setUsername(name))
        .catch(() => {});
    }
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSection !== "Dashboard") {
      window.api.stopMetrics?.();
      return;
    }

    const handleData = (data) => {
      const cpuPercent = data.cpu_percent;
      const cpu = `${cpuPercent}%`;
      const ramPercent = (data.memory_used / data.memory_total) * 100;
      const ram = `${(data.memory_used / 1024 ** 3).toFixed(1)} GB / ${(data.memory_total / 1024 ** 3).toFixed(1)} GB`;
      const diskPercent = (data.disk_used / data.disk_total) * 100;
      const disk = `${(data.disk_used / 1024 ** 3).toFixed(1)} GB / ${(data.disk_total / 1024 ** 3).toFixed(1)} GB`;
      const bytesPerSec =
        data.network_bytes_per_sec !== undefined
          ? data.network_bytes_per_sec
          : data.net_up + data.net_down;
      const network = `${((bytesPerSec * 8) / 1_000_000).toFixed(1)} Mbps`;

      let gpu = "N/A";
      let gpuPercent = null;
      let gpuTemp = null;
      if (
        data.gpu_util !== undefined &&
        data.gpu_mem_used !== undefined &&
        data.gpu_mem_total !== undefined
      ) {
        const util = `${data.gpu_util}%`;
        const mem = `${(data.gpu_mem_used / 1024 ** 3).toFixed(1)} GB / ${(data.gpu_mem_total / 1024 ** 3).toFixed(1)} GB`;
        gpu = `${util} - ${mem}`;
        gpuPercent = data.gpu_util;
      }
      if (data.gpu_temp !== undefined) {
        gpuTemp = `${data.gpu_temp}\u00B0C`;
      }

      setMetrics({
        cpu,
        cpuPercent,
        gpu,
        gpuPercent,
        gpuTemp,
        ram,
        ramPercent,
        disk,
        diskPercent,
        network,
      });
    };

    window.api.startMetrics?.();
    const unsubscribe = window.api.onMetrics(handleData);
    return () => {
      unsubscribe?.();
      window.api.stopMetrics?.();
    };
  }, [activeSection, t]);


  const toggleDark = () => {
    const newDark = !dark;
    document.documentElement.classList.toggle("dark", newDark);
    setDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const runCommand = async (cmd) => {
    const name = cmd.charAt(0).toUpperCase() + cmd.slice(1);
    setLoading(true);
    try {
      await window.api.runScript(cmd);
      toast.success(t("messages.command_success", { cmd: name }));
    } catch (err) {
      console.error(err);
      toast.error(t("messages.command_failed", { cmd: name }));
    } finally {
      setLoading(false);
    }
  };
  const handleOptimize = () => runCommand("auto-optimize");

  const handleClean = async () => {
    setLoading(true);
    try {
      const output = await window.api.runScript("clean");
      setFreedSpace(output.trim());
      toast.success(t("messages.command_success", { cmd: "Clean" }));
    } catch (err) {
      console.error(err);
      toast.error(t("messages.command_failed", { cmd: "Clean" }));
      setFreedSpace("");
    } finally {
      setLoading(false);
    }
  };

  const handleDebloatFull = () => runCommand("debloat-full");
  const handleDebloatLite = () => runCommand("debloat-lite");
  const handleDebloatRestore = () => runCommand("debloat-restore");

  const handleGameBoost = () => runCommand("gamebooster");
  const handleRestore = () => runCommand("restore");
  const handleRestorePoint = () => runCommand("restore-point");
  const handleAdvanced = () => runCommand("advanced");
  const handleCpuAmd = () => runCommand("cpu-amd");
  const handleCpuIntel = () => runCommand("cpu-intel");
  const handleCpuAmdRestore = () => runCommand("cpu-amd-restore");
  const handleCpuIntelRestore = () => runCommand("cpu-intel-restore");
  const handleGpuNvidia = () => runCommand("gpu-nvidia");
  const handleGpuIntel = () => runCommand("gpu-intel");
  const handleGpuAmd = () => runCommand("gpu-amd");
  const handlePubg = () => runCommand("pubg");
  const handleCs2 = () => runCommand("cs2");
  const handleFortnite = () => runCommand("fortnite");
  const handleWarzone = () => runCommand("warzone");
  const handleValorant = () => runCommand("valorant");
  const handleEnergyPlan = () => runCommand("energy-plan");
  const handlePeripheralEnergy = () => runCommand("peripheral-energy");

  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <div>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {t("messages.dashboard_desc")}
            </p>

            <div className="mb-4 space-y-1 text-lg font-medium">
              <p>
                {t("labels.user")}: {username}
              </p>
              <p>
                {t("labels.date")}: {currentTime.toLocaleDateString()}
              </p>
              <p>
                {t("labels.time")}: {currentTime.toLocaleTimeString()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <MetricsCard
                label="CPU"
                value={metrics.cpu}
                icon={<FaMicrochip />}
                percentage={metrics.cpuPercent}
              />
              <MetricsCard
                label="GPU"
                value={
                  metrics.gpu === "N/A" ? t("messages.no_gpu") : metrics.gpu
                }
                icon={<BsGpuCard />}
                percentage={metrics.gpuPercent}
                temperature={
                  metrics.gpuTemp
                    ? `${t("labels.temperature")}: ${metrics.gpuTemp}`
                    : null
                }
              />
              <MetricsCard
                label="RAM"
                value={metrics.ram}
                icon={<FaMemory />}
                percentage={metrics.ramPercent}
              />
              <MetricsCard
                label="Disk"
                value={metrics.disk}
                icon={<FaHdd />}
                percentage={metrics.diskPercent}
              />
              <MetricsCard
                label="Network"
                value={metrics.network}
                icon={<FaNetworkWired />}
              />
            </div>

            <button className="mt-4 btn-primary" onClick={handleRestorePoint}>
              {t("buttons.create_restore_point")}
            </button>
          </div>
        );
      case "System":
        return (
          <div className="space-x-2">
            <button
              className="btn-primary"
              onClick={() => setActiveSection("Optimize")}
            >
              {t("sidebar.optimize")}
            </button>
            <button
              className="btn-primary"
              onClick={() => setActiveSection("Clean")}
            >
              {t("sidebar.clean")}
            </button>
            <button
              className="btn-primary"
              onClick={() => setActiveSection("Debloat")}
            >
              {t("sidebar.debloat")}
            </button>
            <button
              className="btn-primary"
              onClick={() => setActiveSection("Game Booster")}
            >
              {t("sidebar.game_booster")}
            </button>
            <button
              className="btn-primary"
              onClick={() => setActiveSection("Energy")}
            >
              {t("sidebar.energy")}
            </button>
          </div>
        );
      case "Optimize":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Optimize onRun={handleOptimize} />
          </Suspense>
        );
      case "Clean":
        return (
          <div>
            <p className="mb-2">{t("messages.clean_desc")}</p>
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
              {t("messages.clean_extra")}
            </p>
            <button className="btn-success" onClick={handleClean}>
              <FaBroom className="mr-2" />
              {t("buttons.run_clean")}
            </button>
            {freedSpace && (
              <p className="mt-2">
                {t("messages.clean_result", { space: freedSpace })}
              </p>
            )}
          </div>
        );
      case "Debloat":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Debloat
              onFull={handleDebloatFull}
              onLite={handleDebloatLite}
              onRestore={handleDebloatRestore}
            />
          </Suspense>
        );
      case "Game Booster":
        return (
          <div>
            <p className="mb-2">{t("messages.game_booster_desc")}</p>
            <button className="btn-accent" onClick={handleGameBoost}>
              {t("buttons.start_game_booster")}
            </button>
          </div>
        );
      case "CPU":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <CPU
              onAmd={handleCpuAmd}
              onIntel={handleCpuIntel}
              onAmdRestore={handleCpuAmdRestore}
              onIntelRestore={handleCpuIntelRestore}
            />
          </Suspense>
        );
      case "GPU":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <GPU
              onNvidia={handleGpuNvidia}
              onIntel={handleGpuIntel}
              onAmd={handleGpuAmd}
            />
          </Suspense>
        );
      case "Games":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Games onSelect={setActiveSection} />
          </Suspense>
        );
      case "PUBG":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Pubg onRun={handlePubg} />
          </Suspense>
        );
      case "CS2":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Cs2 onRun={handleCs2} />
          </Suspense>
        );
      case "Fortnite":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Fortnite onRun={handleFortnite} />
          </Suspense>
        );
      case "Warzone":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Warzone onRun={handleWarzone} />
          </Suspense>
        );
      case "Valorant":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Valorant onRun={handleValorant} />
          </Suspense>
        );
      case "Energy":
        return (
          <div>
            <p className="mb-2">{t("messages.energy_desc")}</p>
            <div className="space-x-2">
              <button className="btn-primary" onClick={handleEnergyPlan}>
                {t("buttons.apply_energy_plan")}
              </button>
              <button className="btn-primary" onClick={handlePeripheralEnergy}>
                {t("buttons.tweak_peripheral_power")}
              </button>
            </div>
          </div>
        );
      case "Advanced Tweaks":
        return (
          <div>
            <p className="mb-2">{t("messages.advanced_desc")}</p>
            <div className="space-x-2">
              <button className="btn-danger" onClick={handleAdvanced}>
                {t("buttons.run_advanced")}
              </button>
              <button className="btn-neutral" onClick={handleRestore}>
                {t("buttons.restore_tweaks")}
              </button>
            </div>
          </div>
        );
      case "Logs":
        return <Logs />;
      case "Settings":
        return (
          <div>
            <p className="mb-2">{t("messages.settings_desc")}</p>
            <button
              className="px-3 py-1 rounded bg-muted dark:bg-muted-dark"
              onClick={toggleDark}
            >
              {dark ? t("buttons.light_mode") : t("buttons.dark_mode")}
            </button>
            <div className="space-x-2 mt-2">
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white"
                onClick={() => i18n.changeLanguage("en")}
              >
                English
              </button>
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white"
                onClick={() => i18n.changeLanguage("pt")}
              >
                Português
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} />
      <div className="flex-1 p-4 overflow-auto">
        <div className="sticky top-0 z-10 p-4 mb-4 bg-gradient-to-r from-premium via-accent to-secondary backdrop-blur-md bg-opacity-60 rounded-xl shadow-lg flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold">Liiiraa Booster</h1>
          <button
            onClick={toggleDark}
            aria-label={dark ? t("buttons.light_mode") : t("buttons.dark_mode")}
            data-testid="theme-toggle"
          >
            {dark ? <FaSun /> : <FaMoon />}
          </button>
        </div>
        {renderSection()}
        {loading && <Spinner />}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}
