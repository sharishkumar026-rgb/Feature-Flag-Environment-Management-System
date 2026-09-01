
// ============================================================
// FORMATTERS
// ============================================================

// ============================================================
// DATE FORMAT
// ============================================================

export const formatDate = (
  date?: string | Date | null
): string => {
  if (!date) {
    return "-";
  }

  const parsedDate =
    date instanceof Date
      ? date
      : new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

// ============================================================
// DATE AND TIME FORMAT
// ============================================================

export const formatDateTime = (
  date?: string | Date | null
): string => {
  if (!date) {
    return "-";
  }

  const parsedDate =
    date instanceof Date
      ? date
      : new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

// ============================================================
// TIME FORMAT
// ============================================================

export const formatTime = (
  date?: string | Date | null
): string => {
  if (!date) {
    return "-";
  }

  const parsedDate =
    date instanceof Date
      ? date
      : new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }

  return parsedDate.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

// ============================================================
// RELATIVE DATE
// ============================================================

export const formatRelativeDate = (
  date?: string | Date | null
): string => {
  if (!date) {
    return "-";
  }

  const parsedDate =
    date instanceof Date
      ? date
      : new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }

  const now = new Date();

  const difference =
    now.getTime() -
    parsedDate.getTime();

  const seconds =
    Math.floor(
      difference / 1000
    );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  if (days < 30) {
    return `${days} ${
      days === 1
        ? "day"
        : "days"
    } ago`;
  }

  return formatDate(parsedDate);
};

// ============================================================
// CURRENCY FORMAT
// ============================================================

export const formatCurrency = (
  value?: number | null,
  currency = "INR"
): string => {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "-";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }
  ).format(value);
};

// ============================================================
// NUMBER FORMAT
// ============================================================

export const formatNumber = (
  value?: number | null
): string => {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "-";
  }

  return new Intl.NumberFormat(
    "en-IN"
  ).format(value);
};

// ============================================================
// PERCENTAGE FORMAT
// ============================================================

export const formatPercentage = (
  value?: number | null,
  decimals = 0
): string => {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "-";
  }

  return `${value.toFixed(
    decimals
  )}%`;
};

// ============================================================
// BOOLEAN FORMAT
// ============================================================

export const formatBoolean = (
  value?: boolean | null
): string => {
  if (
    value === undefined ||
    value === null
  ) {
    return "-";
  }

  return value
    ? "Yes"
    : "No";
};

// ============================================================
// STATUS FORMAT
// ============================================================

export const formatStatus = (
  isActive?: boolean | null
): string => {
  if (
    isActive === undefined ||
    isActive === null
  ) {
    return "-";
  }

  return isActive
    ? "Active"
    : "Inactive";
};

// ============================================================
// ENABLED STATUS FORMAT
// ============================================================

export const formatEnabledStatus = (
  isEnabled?: boolean | null
): string => {
  if (
    isEnabled === undefined ||
    isEnabled === null
  ) {
    return "-";
  }

  return isEnabled
    ? "Enabled"
    : "Disabled";
};

// ============================================================
// STRING FORMAT
// ============================================================

export const formatText = (
  value?: string | null
): string => {
  if (
    value === undefined ||
    value === null ||
    value.trim() === ""
  ) {
    return "-";
  }

  return value;
};

// ============================================================
// CAPITALIZE
// ============================================================

export const capitalize = (
  value?: string | null
): string => {
  if (
    !value ||
    value.trim() === ""
  ) {
    return "";
  }

  const text =
    value.trim();

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
};

// ============================================================
// TITLE CASE
// ============================================================

export const toTitleCase = (
  value?: string | null
): string => {
  if (
    !value ||
    value.trim() === ""
  ) {
    return "";
  }

  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

// ============================================================
// TRUNCATE TEXT
// ============================================================

export const truncateText = (
  value?: string | null,
  maxLength = 50
): string => {
  if (!value) {
    return "-";
  }

  if (
    value.length <=
    maxLength
  ) {
    return value;
  }

  return `${value.slice(
    0,
    maxLength
  )}...`;
};

// ============================================================
// INITIALS
// ============================================================

export const getInitials = (
  name?: string | null
): string => {
  if (
    !name ||
    name.trim() === ""
  ) {
    return "?";
  }

  const words =
    name
      .trim()
      .split(/\s+/);

  if (words.length === 1) {
    return words[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    words[0].charAt(0) +
    words[
      words.length - 1
    ].charAt(0)
  ).toUpperCase();
};

// ============================================================
// FILE SIZE FORMAT
// ============================================================

export const formatFileSize = (
  bytes?: number | null
): string => {
  if (
    bytes === undefined ||
    bytes === null ||
    Number.isNaN(bytes)
  ) {
    return "-";
  }

  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.floor(
    Math.log(bytes) /
      Math.log(1024)
  );

  const size =
    bytes /
    Math.pow(
      1024,
      index
    );

  return `${size.toFixed(
    index === 0 ? 0 : 2
  )} ${units[index]}`;
};

// ============================================================
// NULL / EMPTY VALUE
// ============================================================

export const displayValue = <T>(
  value: T | null | undefined,
  fallback = "-"
): T | string => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  return value;
};

