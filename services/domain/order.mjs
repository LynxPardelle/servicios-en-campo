function assertAccess(order, command) {
  if (!order?.organizationId || command?.organizationId !== order.organizationId) throw new Error('FORBIDDEN');
  if (!Number.isSafeInteger(command.expectedVersion) || command.expectedVersion !== order.version) throw new Error('VERSION_CONFLICT');
}

function schedule(startsAt, endsAt) {
  const withZone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
  const start = typeof startsAt === 'string' && withZone.test(startsAt) ? Date.parse(startsAt) : NaN;
  const end = typeof endsAt === 'string' && withZone.test(endsAt) ? Date.parse(endsAt) : NaN;
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error('INVALID_SCHEDULE');
  return { start, end };
}

/** Pure validation only. The repository must commit the version and slot reservation atomically. */
export function assignOrder(order, command, occupiedSlots = []) {
  assertAccess(order, command);
  if (order.status !== 'requested') throw new Error('INVALID_TRANSITION');
  if (typeof command.unitId !== 'string' || !command.unitId.trim()) throw new Error('INVALID_ASSIGNMENT');
  const requested = schedule(command.startsAt, command.endsAt);
  for (const slot of occupiedSlots) {
    if (slot.organizationId !== order.organizationId || slot.unitId !== command.unitId) continue;
    const occupied = schedule(slot.startsAt, slot.endsAt);
    if (requested.start < occupied.end && occupied.start < requested.end) throw new Error('UNIT_BUSY');
  }
  return {
    ...order,
    status: 'assigned',
    version: order.version + 1,
    assignment: { unitId: command.unitId, startsAt: new Date(requested.start).toISOString(), endsAt: new Date(requested.end).toISOString() },
  };
}

export function transitionOrder(order, command) {
  assertAccess(order, command);
  const allowed = { requested: ['cancelled'], assigned: ['in_progress', 'cancelled'], in_progress: ['completed'], completed: [], cancelled: [] };
  if (!allowed[order.status]?.includes(command.to)) throw new Error('INVALID_TRANSITION');
  if (command.to === 'completed' && (typeof command.evidenceId !== 'string' || !command.evidenceId.trim())) throw new Error('EVIDENCE_REQUIRED');
  return { ...order, status: command.to, version: order.version + 1, ...(command.to === 'completed' ? { evidenceId: command.evidenceId } : {}) };
}
