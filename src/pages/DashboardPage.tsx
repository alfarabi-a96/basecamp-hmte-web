import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  getCurrentYearData,
  formatCurrency,
  calculateProgress,
  alumniData,
} from "../data/alumniData";
import { ProgressBarProps, StatCardProps } from "../types";
import {
  TrendingUp,
  Users,
  Target,
  Calendar,
  DollarSign,
  Award,
} from "lucide-react";

const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const currentYearData = getCurrentYearData();
  const { grandTotal } = alumniData;

  // Progress bar component
  const ProgressBar: React.FC<ProgressBarProps> = ({
    current,
    target,
    label,
    showPercentage = true,
  }) => {
    const percentage = calculateProgress(current, target);

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{percentage}%</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatCurrency(current)}</span>
          <span>{formatCurrency(target)}</span>
        </div>
      </div>
    );
  };

  // Stat Card Component
  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color = "blue",
    subtitle,
  }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`p-3 rounded-full ${
            color === "green"
              ? "bg-green-100"
              : color === "blue"
              ? "bg-blue-100"
              : color === "purple"
              ? "bg-purple-100"
              : color === "yellow"
              ? "bg-yellow-100"
              : "bg-blue-100"
          }`}
        >
          <Icon
            className={`h-6 w-6 ${
              color === "green"
                ? "text-green-600"
                : color === "blue"
                ? "text-blue-600"
                : color === "purple"
                ? "text-purple-600"
                : color === "yellow"
                ? "text-yellow-600"
                : "text-blue-600"
            }`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Selamat datang, {user?.name}!
            </h1>
            <p className="text-blue-100 mt-1">
              {isAdmin() ? "Panel Administrator" : "Dashboard Guest"} - Laporan
              Keuangan Iuran Alumni
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="text-right">
              <p className="text-sm text-blue-100">Tahun Aktif</p>
              <p className="text-xl font-bold">{currentYearData.year}</p>
            </div>
          </div>
        </div>
        {isAdmin() && (
          <div className="mt-4 bg-red-50 p-3">
            <p className="text-orange-700 mb-4">
              Sebagai admin, Anda dapat mengedit laporan dan mengelola data
              iuran.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">Edit Laporan Iuran</button>
              <button className="btn-secondary">Kelola Angkatan</button>
              <button className="btn-secondary">Export Data</button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Iuran Tahun Ini"
          value={formatCurrency(currentYearData.collected)}
          icon={DollarSign}
          color="green"
          subtitle={`dari ${formatCurrency(currentYearData.target)}`}
        />
        <StatCard
          title="Progress Tahun Ini"
          value={`${calculateProgress(
            currentYearData.collected,
            currentYearData.target
          )}%`}
          icon={Target}
          color="blue"
          subtitle="dari target"
        />
        <StatCard
          title="Total Keseluruhan"
          value={formatCurrency(grandTotal.totalCollected)}
          icon={Award}
          color="yellow"
          subtitle="semua tahun"
        />
      </div>

      {/* Main Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Year Progress */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Progress Iuran {currentYearData.year}
            </h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>

          <ProgressBar
            current={currentYearData.collected}
            target={currentYearData.target}
            label="Target Tahunan"
          />

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Update terakhir:</span>
                <span className="font-medium ml-2">
                  {currentYearData.lastUpdated}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Total Keseluruhan
            </h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>

          <ProgressBar
            current={grandTotal.totalCollected}
            target={grandTotal.totalTarget}
            label="Total Semua Tahun"
          />

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Rata-rata per tahun:</span>
                <span className="font-medium">
                  {formatCurrency(grandTotal.averagePerYear)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown by Class (Current Year) */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Kontribusi per Angkatan ({currentYearData.year})
        </h3>

        <div className="space-y-4">
          {currentYearData.byClass.map((classData, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  {classData.className}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${calculateProgress(
                      classData.contributors,
                      classData.totalAlumni
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatCurrency(classData.collected)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
