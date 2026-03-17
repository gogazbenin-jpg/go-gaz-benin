import React from "react";

export interface BrandColors {
  primary: string;
  primaryDark: string;
  name: string;
  subName: string;
}

export const brandColorMap: Record<string, BrandColors> = {
  oryx: {
    primary: "#E74C3C",
    primaryDark: "#C0392B",
    name: "ORYX",
    subName: "Énergie",
  },
  "benin-petro": {
    primary: "#27AE60",
    primaryDark: "#1E8449",
    name: "BÉNIN",
    subName: "Pétro",
  },
  puma: {
    primary: "#2E86C1",
    primaryDark: "#1A5276",
    name: "PUMA",
    subName: "Énergie",
  },
  progaz: {
    primary: "#8E44AD",
    primaryDark: "#6C3483",
    name: "PRO",
    subName: "GAZ",
  },
};

interface GasBottleProps {
  brandId: string;
  size: "3kg" | "6kg" | "12kg" | "25kg";
  className?: string;
}

const sizeConfig = {
  "3kg": { height: 80, width: 44, label: "3kg" },
  "6kg": { height: 100, width: 55, label: "6kg" },
  "12kg": { height: 135, width: 65, label: "12kg" },
  "25kg": { height: 170, width: 80, label: "25kg" },
};

const GasBottle: React.FC<GasBottleProps> = ({ brandId, size, className = "" }) => {
  const colors = brandColorMap[brandId] || brandColorMap.oryx;
  const dim = sizeConfig[size];
  const gradId = `grad-${brandId}-${size}`;
  const reflectId = `reflect-${brandId}-${size}`;
  const shadowId = `shadow-${brandId}-${size}`;

  const svgW = dim.width + 20;
  const svgH = dim.height + 30;

  const cx = svgW / 2;
  const bodyW = dim.width;
  const bodyH = dim.height * 0.55;
  const shoulderH = dim.height * 0.12;
  const neckH = dim.height * 0.1;
  const neckW = bodyW * 0.22;
  const valveR = bodyW * 0.12;
  const handleW = bodyW * 0.35;
  const handleH = dim.height * 0.08;

  const baseY = svgH - 15;
  const bodyTop = baseY - bodyH;
  const shoulderTop = bodyTop - shoulderH;
  const neckTop = shoulderTop - neckH;
  const valveY = neckTop - valveR;
  const handleTop = valveY - handleH - 2;

  const bodyLeft = cx - bodyW / 2;
  const bodyRight = cx + bodyW / 2;
  const bodyRadius = bodyW * 0.12;

  // Label dimensions
  const labelW = bodyW * 0.65;
  const labelH = bodyH * 0.55;
  const labelX = cx - labelW / 2;
  const labelY = bodyTop + bodyH * 0.2;

  const isBenin = brandId === "benin-petro";

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      className={className}
      style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.primaryDark} />
        </linearGradient>
        <linearGradient id={reflectId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" />
          <stop offset="40%" stopColor="white" stopOpacity="0.05" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="black" stopOpacity="0.2" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx={cx} cy={baseY + 5} rx={bodyW * 0.45} ry={4} fill={`url(#${shadowId})`} />

      {/* Body */}
      <rect
        x={bodyLeft}
        y={bodyTop}
        width={bodyW}
        height={bodyH}
        rx={bodyRadius}
        ry={bodyRadius}
        fill={`url(#${gradId})`}
      />

      {/* Base */}
      <rect
        x={bodyLeft + 2}
        y={baseY - 6}
        width={bodyW - 4}
        height={6}
        rx={2}
        fill={colors.primaryDark}
        opacity={0.7}
      />

      {/* Shoulder */}
      <path
        d={`M ${bodyLeft} ${bodyTop + 2}
            Q ${bodyLeft} ${shoulderTop} ${cx - neckW} ${shoulderTop}
            L ${cx - neckW} ${shoulderTop}
            L ${cx + neckW} ${shoulderTop}
            Q ${bodyRight} ${shoulderTop} ${bodyRight} ${bodyTop + 2}`}
        fill={`url(#${gradId})`}
      />

      {/* Neck */}
      <rect
        x={cx - neckW}
        y={neckTop}
        width={neckW * 2}
        height={neckH + 2}
        rx={2}
        fill={`url(#${gradId})`}
      />

      {/* Valve */}
      <circle cx={cx} cy={valveY} r={valveR} fill="#95A5A6" />
      <circle cx={cx - valveR * 0.3} cy={valveY - valveR * 0.3} r={valveR * 0.25} fill="white" opacity={0.4} />

      {/* Handle */}
      <path
        d={`M ${cx - handleW / 2} ${valveY - 1}
            Q ${cx - handleW / 2} ${handleTop} ${cx} ${handleTop}
            Q ${cx + handleW / 2} ${handleTop} ${cx + handleW / 2} ${valveY - 1}`}
        fill="none"
        stroke="#2C3E50"
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Reflection */}
      <rect
        x={bodyLeft}
        y={bodyTop}
        width={bodyW * 0.3}
        height={bodyH}
        rx={bodyRadius}
        fill={`url(#${reflectId})`}
      />
      <path
        d={`M ${bodyLeft} ${bodyTop + 2}
            Q ${bodyLeft} ${shoulderTop} ${cx - neckW} ${shoulderTop}
            L ${cx - neckW + bodyW * 0.15} ${shoulderTop}
            Q ${bodyLeft + bodyW * 0.3} ${shoulderTop} ${bodyLeft + bodyW * 0.3} ${bodyTop + 2}`}
        fill="white"
        opacity={0.12}
      />

      {/* Label background */}
      <rect
        x={labelX}
        y={labelY}
        width={labelW}
        height={labelH}
        rx={3}
        fill="white"
        opacity={0.95}
      />

      {/* Brand name */}
      <text
        x={cx}
        y={labelY + labelH * 0.32}
        textAnchor="middle"
        fill={colors.primaryDark}
        fontSize={Math.max(8, labelW * 0.2)}
        fontWeight="800"
        fontFamily="sans-serif"
      >
        {colors.name}
      </text>

      {/* Sub name */}
      <text
        x={cx}
        y={labelY + labelH * 0.52}
        textAnchor="middle"
        fill="#7F8C8D"
        fontSize={Math.max(5, labelW * 0.12)}
        fontWeight="500"
        fontFamily="sans-serif"
      >
        {colors.subName}
      </text>

      {/* Benin yellow band */}
      {isBenin && (
        <rect
          x={labelX}
          y={labelY + labelH * 0.58}
          width={labelW}
          height={labelH * 0.08}
          fill="#F1C40F"
        />
      )}

      {/* Size */}
      <text
        x={cx}
        y={labelY + labelH * 0.82}
        textAnchor="middle"
        fill={colors.primary}
        fontSize={Math.max(8, labelW * 0.2)}
        fontWeight="700"
        fontFamily="sans-serif"
      >
        {dim.label}
      </text>

      {/* GPL text */}
      <text
        x={cx}
        y={labelY + labelH * 0.96}
        textAnchor="middle"
        fill="#95A5A6"
        fontSize={Math.max(4, labelW * 0.08)}
        fontFamily="sans-serif"
      >
        GPL
      </text>
    </svg>
  );
};

export default GasBottle;
