import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
const event = (id, type, body) => ({
  id: randomUUID(),
  enquiry_id: id,
  type,
  body,
  created_at: new Date().toISOString(),
});
export function createDemoStore(file = path.resolve('.local/admin-demo.json')) {
  let queue = Promise.resolve();
  const run = (fn) => {
    const task = queue.then(async () => {
      let db;
      try {
        db = JSON.parse(await fs.readFile(file, 'utf8'));
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
        db = { enquiries: [], activity: [] };
        const now = new Date();
        const date = now.toISOString().slice(0, 10);
        const samples = [
          [
            'Maya Roberts',
            'Willow Garden Care',
            'web-design-development',
            'opportunity',
            'A clearer website for our garden services and a simpler route to request a quote.',
          ],
          [
            'Alex Taylor',
            'Northline Retail',
            'power-bi',
            'understand',
            'Bring online and shop sales together so we can compare gross margin by channel.',
          ],
          [
            'Sam Wilson',
            'Harbour Projects',
            'power-automate',
            'agree',
            'Keep quote follow-ups visible and stop the reminder when a customer replies.',
          ],
          [
            'Jordan Lee',
            'Fieldwork Packing',
            'custom-business-apps',
            'build',
            'A weekly planner that puts packing demand beside available staff hours.',
          ],
          [
            'Casey Morgan',
            'Oak Studio',
            'system-integrations',
            'test',
            'Connect order records to reporting and hold incomplete product codes for review.',
          ],
          [
            'Robin Ellis',
            'Westgate Consulting',
            'ai-assistants',
            'handover',
            'A support assistant that answers delivery questions from authorised order records.',
          ],
        ];
        db.enquiries = samples.map(([name, organisation, service, stage, message], i) => ({
          id: randomUUID(),
          name,
          organisation,
          email: `contact${i + 1}@example.com`,
          phone: '',
          website: '',
          service,
          stage,
          message,
          status: 'active',
          priority: i === 0 ? 'high' : 'normal',
          next_action:
            i === 0 ? 'Arrange the first conversation.' : 'Review the next project decision.',
          follow_up_date: i < 2 ? date : null,
          source: 'demo',
          version: 1,
          created_at: new Date(now.getTime() - i * 86400000).toISOString(),
          updated_at: now.toISOString(),
        }));
        db.activity = db.enquiries.map((e) => event(e.id, 'created', 'Demo enquiry added.'));
      }
      const result = await fn(db);
      await fs.mkdir(path.dirname(file), { recursive: true });
      const tmp = file + '.tmp';
      await fs.writeFile(tmp, JSON.stringify(db, null, 2), { mode: 0o600 });
      await fs.rename(tmp, file);
      return result;
    });
    queue = task.catch(() => {});
    return task;
  };
  return {
    intake: (data, key, fingerprint) =>
      run((db) => {
        const existing = db.enquiries.find((e) => e.submission_key === key);
        if (existing)
          return existing.submission_fingerprint === fingerprint ? existing : { conflict: true };
        const now = new Date().toISOString();
        const enquiry = {
          ...data,
          id: randomUUID(),
          version: 1,
          created_at: now,
          updated_at: now,
          submission_key: key,
          submission_fingerprint: fingerprint,
        };
        db.enquiries.push(enquiry);
        db.activity.push(event(enquiry.id, 'created', 'Demo website enquiry received.'));
        return enquiry;
      }),
    list: (offset = 0) =>
      run((db) => ({
        items: db.enquiries
          .slice()
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .slice(offset, offset + 100),
        hasMore: db.enquiries.length > offset + 100,
      })),
    detail: (id) =>
      run((db) => {
        const enquiry = db.enquiries.find((e) => e.id === id);
        return enquiry
          ? {
              enquiry,
              activity: db.activity
                .filter((a) => a.enquiry_id === id)
                .sort((a, b) => b.created_at.localeCompare(a.created_at)),
            }
          : null;
      }),
    create: (data) =>
      run((db) => {
        const now = new Date().toISOString();
        const enquiry = {
          ...data,
          id: randomUUID(),
          version: 1,
          source: data.source || 'manual',
          created_at: now,
          updated_at: now,
        };
        db.enquiries.push(enquiry);
        db.activity.push(
          event(
            enquiry.id,
            'created',
            data.source === 'website' ? 'Website enquiry received.' : 'Enquiry added.',
          ),
        );
        return enquiry;
      }),
    update: (id, patch) =>
      run((db) => {
        const enquiry = db.enquiries.find((e) => e.id === id);
        if (!enquiry) return null;
        if (enquiry.version !== patch.version) return { conflict: true };
        const { version, ...changes } = patch;
        const oldStage = enquiry.stage,
          oldStatus = enquiry.status;
        const detailsChanged = Object.entries(changes).some(
          ([key, value]) => !['stage', 'status'].includes(key) && enquiry[key] !== value,
        );
        Object.assign(enquiry, changes, {
          version: version + 1,
          updated_at: new Date().toISOString(),
        });
        if (oldStage !== enquiry.stage)
          db.activity.push(event(id, 'stage_changed', `Stage: ${oldStage} → ${enquiry.stage}`));
        if (oldStatus !== enquiry.status)
          db.activity.push(event(id, 'status_changed', `Status: ${oldStatus} → ${enquiry.status}`));
        if (detailsChanged)
          db.activity.push(event(id, 'details_updated', 'Enquiry details updated.'));
        return enquiry;
      }),
    note: (id, body) =>
      run((db) => {
        if (!db.enquiries.some((e) => e.id === id)) return null;
        const note = event(id, 'note_added', body);
        db.activity.push(note);
        return note;
      }),
  };
}
