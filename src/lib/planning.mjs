/** Calculate workload from units, handling time and actual available staff hours. */
export function calculatePlan(units, staff = 3, hoursPerPerson = 32, minutesPerUnit = 4) {
  const values = [units, staff, hoursPerPerson, minutesPerUnit].map(Number);
  if (values.some((value) => !Number.isFinite(value) || value < 0) || values[3] === 0)
    throw new RangeError(
      'Planning inputs must be finite, non-negative and handling time must be positive.',
    );
  const [volume, people, hours, minutes] = values;
  const requiredHours = (volume * minutes) / 60;
  const availableHours = people * hours;
  return {
    units: volume,
    requiredHours,
    availableHours,
    balance: availableHours - requiredHours,
    utilization: availableHours ? (requiredHours / availableHours) * 100 : 0,
    capacityUnits: (availableHours * 60) / minutes,
  };
}
export const formatHours = (value) => (Number.isInteger(value) ? String(value) : value.toFixed(1));
