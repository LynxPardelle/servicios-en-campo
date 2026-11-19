import test from 'node:test';
import assert from 'node:assert/strict';
import { assignOrder, transitionOrder } from './order.mjs';

const requested = () => ({ id: 'order-1', organizationId: 'org-a', status: 'requested', version: 1, assignment: null });
const assignment = () => ({ organizationId: 'org-a', expectedVersion: 1, unitId: 'unit-1', startsAt: '2026-11-20T10:00:00Z', endsAt: '2026-11-20T11:00:00Z' });

test('assigns a requested order without mutating the original snapshot', () => {
  const original = requested();
  const assigned = assignOrder(original, assignment());
  assert.equal(assigned.status, 'assigned');
  assert.equal(assigned.version, 2);
  assert.equal(assigned.assignment.unitId, 'unit-1');
  assert.equal(original.status, 'requested');
  assert.equal(original.assignment, null);
});

test('rejects an occupied time slot but allows adjacent appointments', () => {
  const occupied = [{ organizationId: 'org-a', unitId: 'unit-1', startsAt: '2026-11-20T10:30:00Z', endsAt: '2026-11-20T11:30:00Z' }];
  assert.throws(() => assignOrder(requested(), assignment(), occupied), /UNIT_BUSY/);
  const adjacent = [{ ...occupied[0], startsAt: '2026-11-20T11:00:00Z' }];
  assert.equal(assignOrder(requested(), assignment(), adjacent).status, 'assigned');
});

test('rejects cross-organization access, stale versions and invalid schedules', () => {
  assert.throws(() => assignOrder(requested(), { ...assignment(), organizationId: 'org-b' }), /FORBIDDEN/);
  assert.throws(() => assignOrder(requested(), { ...assignment(), expectedVersion: 0 }), /VERSION_CONFLICT/);
  assert.throws(() => assignOrder(requested(), { ...assignment(), endsAt: assignment().startsAt }), /INVALID_SCHEDULE/);
  assert.throws(() => assignOrder(requested(), { ...assignment(), startsAt: 'not-a-date' }), /INVALID_SCHEDULE/);
});

test('does not assign a second unit to an already assigned order', () => {
  const assigned = assignOrder(requested(), assignment());
  assert.throws(() => assignOrder(assigned, { ...assignment(), expectedVersion: 2, unitId: 'unit-2' }), /INVALID_TRANSITION/);
});

test('requires the assigned and in-progress states before completion with evidence', () => {
  const assigned = assignOrder(requested(), assignment());
  const started = transitionOrder(assigned, { organizationId: 'org-a', expectedVersion: 2, to: 'in_progress' });
  assert.throws(() => transitionOrder(started, { organizationId: 'org-a', expectedVersion: 3, to: 'completed' }), /EVIDENCE_REQUIRED/);
  const completed = transitionOrder(started, { organizationId: 'org-a', expectedVersion: 3, to: 'completed', evidenceId: 'evidence-1' });
  assert.equal(completed.status, 'completed');
  assert.equal(completed.version, 4);
  assert.equal(completed.evidenceId, 'evidence-1');
  assert.throws(() => transitionOrder(completed, { organizationId: 'org-a', expectedVersion: 4, to: 'in_progress' }), /INVALID_TRANSITION/);
  assert.throws(() => transitionOrder(requested(), { organizationId: 'org-a', expectedVersion: 1, to: 'completed', evidenceId: 'evidence-1' }), /INVALID_TRANSITION/);
});

test('checks tenant and optimistic version for every transition', () => {
  assert.throws(() => transitionOrder(requested(), { organizationId: 'org-b', expectedVersion: 1, to: 'cancelled' }), /FORBIDDEN/);
  assert.throws(() => transitionOrder(requested(), { organizationId: 'org-a', expectedVersion: 2, to: 'cancelled' }), /VERSION_CONFLICT/);
  assert.equal(transitionOrder(requested(), { organizationId: 'org-a', expectedVersion: 1, to: 'cancelled' }).status, 'cancelled');
});
