// Which BigChange job types and equipment categories count towards each
// homepage live number. Names must match BigChange exactly (case-insensitive).
// Product categories (BigChange > Stock & Equipment) whose equipment counts as an
// "AC unit". Matched by name, case-insensitive. Fridges, freezers, dehumidifiers
// and controllers are deliberately left out.
export const AC_CATEGORY_NAMES = [
  "RAC - Condenser",
  "RAC - Cassette Air Conditioning Unit",
  "RAC - Air Conditioning",
  "RAC - Wall Mounted Air Conditioning Unit",
  "RAC - Ducted Air Conditioning Unit",
  "RAC - Heat Recovery Unit",
  "RAC - VRF Air Conditioning Unit",
  "RAC - Air Handling Unit",
  "RAC - FAN COIL UNITS",
  "RAC - Package Air Conditioning Unit",
  "RAC - Air Source Heat Pump",
  "RAC - Under Ceiling Air Conditioning Unit",
  "RAC - Floor Standing Air Conditioning Unit",
];

export const SERVICE_JOB_TYPES = [
  "Service",
  "RPZ Service",
  "Fire Damper - Service",
  "Domestic & Non Contracted Service",
  "MCS - O&M",
];

// Internal or test job types that are not customer work, left out of every count.
export const EXCLUDED_JOB_TYPES = [
  "Office",
  "COVID-19 Questionnaire",
  "Training",
  "Meeting",
  "ToolBox Talk",
  "zAccident",
  "TEST - SERVICE TASKS",
  "Test Service",
  "Test FGAS",
];

export const COMPLETED_STATUSES = ["completedOk", "completedWithIssues"];

export const STAT_KEYS = ["acUnits", "jobs", "services", "customers"] as const;
export type StatKey = (typeof STAT_KEYS)[number];

// How often the server runs the BigChange sync (the cron schedule must match this).
export const SYNC_INTERVAL_HOURS = 6;
