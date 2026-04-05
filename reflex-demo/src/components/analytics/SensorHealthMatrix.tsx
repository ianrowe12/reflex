"use client";

import { sensorHealthData } from "@/data/mock-data";

const units = ["CDU", "FCC", "HCU", "Reformer", "Blend"] as const;
const sensorTypes = ["Temp", "Pressure", "Flow", "Level", "Comp"] as const;

const statusColors: Record<string, string> = {
  healthy: "#0D9488",
  degraded: "#D97706",
  substituted: "#DC2626",
};

const statusLabels: Record<string, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  substituted: "Substituted",
};

function getStatus(unit: string, sensorType: string): string {
  const cell = sensorHealthData.find(
    (c) => c.unit === unit && c.sensorType === sensorType
  );
  return cell?.status ?? "healthy";
}

export function SensorHealthMatrix() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-headline font-semibold text-[#111827]">
          Sensor Health Matrix
        </h3>
        <div className="flex items-center gap-3">
          {Object.entries(statusLabels).map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5 text-[10px] font-mono text-[#9CA3AF]">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: statusColors[key] }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-[10px] font-mono font-normal text-[#9CA3AF] uppercase tracking-wider pb-2 pr-3">
                Unit
              </th>
              {sensorTypes.map((st) => (
                <th
                  key={st}
                  className="text-center text-[10px] font-mono font-normal text-[#9CA3AF] uppercase tracking-wider pb-2 px-1"
                >
                  {st}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit}>
                <td className="text-xs font-mono text-[#4B5563] py-1.5 pr-3 whitespace-nowrap">
                  {unit}
                </td>
                {sensorTypes.map((st) => {
                  const status = getStatus(unit, st);
                  return (
                    <td key={st} className="text-center py-1.5 px-1">
                      <span
                        className="inline-block rounded-sm"
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: statusColors[status],
                        }}
                        title={`${unit} ${st}: ${status}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
