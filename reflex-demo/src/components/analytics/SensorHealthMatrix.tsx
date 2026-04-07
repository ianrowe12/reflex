"use client";

import { sensorHealthData } from "@/data/mock-data";
import { useChartTheme } from "@/lib/chart-theme";

const units = ["CDU", "FCC", "HCU", "Reformer", "Blend"] as const;
const sensorTypes = ["Temp", "Pressure", "Flow", "Level", "Comp"] as const;

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
  const t = useChartTheme();

  const statusColors: Record<string, string> = {
    healthy: t.healthy,
    degraded: t.warning,
    substituted: t.critical,
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-headline font-semibold text-text-primary">
          Sensor Health Matrix
        </h3>
        <div className="flex items-center gap-3">
          {Object.entries(statusLabels).map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
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
              <th className="text-left text-[10px] font-mono font-normal text-text-muted uppercase tracking-wider pb-2 pr-3">
                Unit
              </th>
              {sensorTypes.map((st) => (
                <th
                  key={st}
                  className="text-center text-[10px] font-mono font-normal text-text-muted uppercase tracking-wider pb-2 px-1"
                >
                  {st}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit}>
                <td className="text-xs font-mono text-text-secondary py-1.5 pr-3 whitespace-nowrap">
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
