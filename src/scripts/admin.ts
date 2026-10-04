export {};
type Enquiry = {
  id: string;
  name: string;
  email: string;
  organisation: string;
  phone: string;
  website: string;
  service: string;
  message: string;
  stage: string;
  status: string;
  priority: string;
  next_action: string;
  follow_up_date: string | null;
  source: string;
  version: number;
  created_at: string;
  updated_at: string;
};
type Activity = { id: string; type: string; body: string; created_at: string };
const stages = [
  ['opportunity', 'Opportunity'],
  ['understand', 'Understand'],
  ['agree', 'Agree'],
  ['build', 'Build'],
  ['test', 'Test'],
  ['handover', 'Hand over'],
];
const services = [
  ['power-bi', 'Power BI'],
  ['power-automate', 'Power Automate'],
  ['ai-assistants', 'AI assistants'],
  ['jev-ai-integration', 'Jev integration'],
  ['custom-business-apps', 'Custom business apps'],
  ['system-integrations', 'System integrations'],
  ['web-design-development', 'Web design & development'],
  ['website-optimisation', 'Website optimisation'],
  ['seo', 'SEO'],
  ['computer-vision', 'Computer vision'],
];
const statuses = [
  ['active', 'Active'],
  ['on_hold', 'On hold'],
  ['completed', 'Completed'],
  ['not_proceeding', 'Not proceeding'],
];
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (value: unknown) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
const label = (items: string[][], value: string) => items.find((x) => x[0] === value)?.[1] || value;
const date = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).format(new Date(value.length === 10 ? value + 'T12:00:00Z' : value));
const today = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
const options = (items: string[][], selected = '') =>
  items
    .map(
      ([value, name]) =>
        `<option value="${esc(value)}" ${value === selected ? 'selected' : ''}>${esc(name)}</option>`,
    )
    .join('');
let records: Enquiry[] = [],
  hasMore = false,
  view = innerWidth < 800 ? 'list' : 'board',
  mode = '',
  busy = false;
class APIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
async function api(path: string, method = 'GET', body?: unknown) {
  const response = await fetch('/api/admin/' + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 && path !== 'login' && path !== 'session') {
      el('enquiry-dialog').hasAttribute('open') && el<HTMLDialogElement>('enquiry-dialog').close();
      el('dashboard-view').hidden = true;
      el('login-view').hidden = false;
      records = [];
      el('pipeline-content').replaceChildren();
      el('pipeline-metrics').replaceChildren();
      el('enquiry-dialog-body').replaceChildren();
      el('login-status').textContent = 'Your session expired. Please sign in again.';
    }
    throw new APIError(data.message || 'The request could not be completed.', response.status);
  }
  return data;
}
function showStatus(message: string, error = false) {
  el('admin-status').textContent = message;
  el('admin-status').dataset.error = String(error);
}
function pending(button: HTMLButtonElement, fn: () => Promise<void>) {
  if (button.disabled) return;
  button.disabled = true;
  fn()
    .catch((e) => showStatus(e.message || 'Please retry.', true))
    .finally(() => (button.disabled = false));
}
function isOpen(e: Enquiry) {
  return ['active', 'on_hold'].includes(e.status);
}
function isDue(e: Enquiry) {
  return e.status === 'active' && e.follow_up_date && e.follow_up_date <= today();
}
function render() {
  const active = records.filter(isOpen),
    due = records.filter(isDue),
    projects = active.filter((e) => ['build', 'test', 'handover'].includes(e.stage));
  el('pipeline-metrics').innerHTML = [
    [
      'Open opportunities',
      active.filter((e) => e.stage === 'opportunity').length,
      'Start the next conversation',
    ],
    ['Active & on hold', active.length, 'Across the customer journey'],
    ['Follow-ups due', due.length, 'Today or overdue'],
    ['In delivery', projects.length, 'Build, test and handover'],
  ]
    .map(
      ([title, value, detail]) =>
        `<article><span>${title}</span><strong>${value}</strong><small>${detail}</small></article>`,
    )
    .join('');
  const search = el<HTMLInputElement>('customer-search').value.trim().toLowerCase(),
    service = el<HTMLSelectElement>('service-filter').value,
    filter = el<HTMLSelectElement>('status-filter').value,
    follow = el<HTMLSelectElement>('followup-filter').value;
  const shown = records.filter(
    (e) =>
      (!search ||
        [e.name, e.organisation, e.email, e.message].some((v) =>
          v.toLowerCase().includes(search),
        )) &&
      (!service || e.service === service) &&
      (filter === 'all' || (filter === 'open' && isOpen(e)) || e.status === filter) &&
      (follow === 'all' ||
        (follow === 'due' && isDue(e)) ||
        (follow === 'none' && !e.follow_up_date)),
  );
  el('result-count').textContent =
    `${shown.length} ${shown.length === 1 ? 'enquiry' : 'enquiries'} shown${hasMore ? ' · totals cover loaded enquiries; load more to include older records' : ''}`;
  el('load-more').hidden = !hasMore;
  el('board-view').setAttribute('aria-pressed', String(view === 'board'));
  el('list-view').setAttribute('aria-pressed', String(view === 'list'));
  const card = (e: Enquiry) =>
    `<button class="customer-card" data-customer="${esc(e.id)}"><div class="customer-card-top"><span class="customer-initial">${esc(e.name.charAt(0))}</span><span class="priority priority-${esc(e.priority)}">${esc(e.priority === 'high' ? 'High priority' : e.priority === 'low' ? 'Low priority' : 'Normal')}</span></div><strong>${esc(e.organisation || e.name)}</strong><span class="customer-person">${esc(e.organisation ? e.name : e.email)}</span><span class="customer-service">${esc(label(services, e.service) || 'Service to discuss')}</span><p>${esc(e.next_action || 'Set the next action.')}</p><div class="customer-card-bottom"><span>${e.follow_up_date ? `${isDue(e) ? 'Due · ' : ''}${esc(date(e.follow_up_date))}` : 'No follow-up date'}</span>${e.status !== 'active' ? `<span>${esc(label(statuses, e.status))}</span>` : ''}</div></button>`;
  if (view === 'board')
    el('pipeline-content').innerHTML =
      `<nav class="stage-jumps" aria-label="Jump to customer stage">${stages.map(([key, title]) => `<button data-jump-stage="${key}">${title}<span>${shown.filter((e) => e.stage === key).length}</span></button>`).join('')}</nav><div class="pipeline-board" tabindex="0" aria-label="Customer stages; scroll horizontally to see all stages">${stages
        .map(([key, title], i) => {
          const items = shown.filter((e) => e.stage === key);
          return `<section class="pipeline-column" data-column="${key}"><div class="column-heading"><span>0${i + 1}</span><h3>${title}</h3><strong>${items.length}</strong></div>${items.map(card).join('') || '<div class="empty-column">Room for the next step.</div>'}</section>`;
        })
        .join('')}</div>`;
  else
    el('pipeline-content').innerHTML = shown.length
      ? `<div class="customer-list">${shown.map((e) => `<div class="customer-list-item"><span class="list-stage">${esc(label(stages, e.stage))}</span>${card(e)}</div>`).join('')}</div>`
      : '<div class="empty-pipeline"><h3>No matching enquiries.</h3><p>Try different filters or add the first enquiry.</p></div>';
  el('pipeline-content')
    .querySelectorAll<HTMLButtonElement>('[data-jump-stage]')
    .forEach((button) =>
      button.addEventListener('click', () => {
        const board = document.querySelector<HTMLElement>('.pipeline-board')!;
        const column = board.querySelector<HTMLElement>(
          `[data-column="${button.dataset.jumpStage}"]`,
        )!;
        board.scrollTo({
          left:
            board.scrollLeft +
            column.getBoundingClientRect().left -
            board.getBoundingClientRect().left -
            25,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
      }),
    );
  el('pipeline-content')
    .querySelectorAll<HTMLButtonElement>('[data-customer]')
    .forEach((button) =>
      button.addEventListener('click', () =>
        pending(button, () => openRecord(button.dataset.customer!)),
      ),
    );
}
async function load(more = false) {
  const result = await api(`enquiries?offset=${more ? records.length : 0}`);
  records = more ? [...records, ...result.items] : result.items;
  hasMore = result.hasMore;
  render();
}
async function enter(session: { mode: string; email: string }) {
  mode = session.mode;
  el('admin-identity').textContent = session.email;
  el('demo-banner').hidden = mode !== 'demo';
  el('login-view').hidden = true;
  el('dashboard-view').hidden = false;
  await load();
  el('admin-main').focus();
}
const input = (title: string, name: string, value = '', type = 'text', extra = '') =>
  `<label>${esc(title)}<input name="${name}" type="${type}" value="${esc(value)}" ${extra}/></label>`;
function lockDialog(locked: boolean) {
  el('enquiry-dialog')
    .querySelectorAll<HTMLButtonElement>('button')
    .forEach((button) => (button.disabled = locked));
}
el('enquiry-dialog').addEventListener('cancel', (event) => {
  if (busy) event.preventDefault();
});
function dialogContent(record: Enquiry | null, activity: Activity[] = []) {
  el('enquiry-dialog-title').textContent = record
    ? record.organisation || record.name
    : 'Add an enquiry';
  const e = record || {
    name: '',
    email: '',
    organisation: '',
    phone: '',
    website: '',
    service: '',
    message: '',
    stage: 'opportunity',
    status: 'active',
    priority: 'normal',
    next_action: '',
    follow_up_date: null,
  };
  el('enquiry-dialog-body').innerHTML =
    `<div class="detail-grid"><form id="enquiry-editor"><div class="record-context">${record ? `<span>Received ${esc(date(record.created_at))}</span><span>Source · ${esc(record.source)}</span>` : '<span>New enquiries start as an opportunity.</span>'}</div><div class="record-flow"><label>Project stage<select name="stage">${options(stages, e.stage)}</select></label><label>Customer status<select name="status">${options(statuses, e.status)}</select></label></div><h3>The contact</h3><div class="form-grid">${input('Name', 'name', e.name, 'text', 'required maxlength="120"')}${input('Email', 'email', e.email, 'email', 'required maxlength="254"')}${input('Business / organisation', 'organisation', e.organisation, 'text', 'maxlength="160"')}${input('Phone', 'phone', e.phone, 'tel', 'maxlength="50"')}</div>${input('Website', 'website', e.website, 'url', 'maxlength="500" placeholder="https://"')}<label>Service<select name="service">${options([['', 'Not sure yet'], ...services], e.service)}</select></label><label>Original enquiry<textarea name="message" rows="4" required minlength="10" maxlength="5000">${esc(e.message)}</textarea></label><h3>The next step</h3><label>Next action<textarea name="next_action" rows="2" maxlength="500" placeholder="What needs to happen next?">${esc(e.next_action)}</textarea></label><div class="form-grid">${input('Follow-up date', 'follow_up_date', e.follow_up_date || '', 'date')}<label>Priority<select name="priority">${options(
      [
        ['low', 'Low'],
        ['normal', 'Normal'],
        ['high', 'High'],
      ],
      e.priority,
    )}</select></label></div><p id="record-status" class="record-status" role="status"></p><div class="record-save"><button class="admin-button" type="submit">${record ? 'Save changes' : 'Create opportunity'}</button>${record ? '<button class="admin-secondary" type="button" id="reload-record">Reload record</button>' : ''}</div></form><aside class="record-history"><h3>Conversation & activity</h3>${record ? `<form id="note-form"><label>Add a private note<textarea name="body" rows="3" required maxlength="5000" placeholder="A conversation, a decision or something to remember…"></textarea></label><button class="admin-secondary" type="submit">Add note</button><p id="note-status" role="status"></p></form><ol class="activity-list">${activity.map((a) => `<li class="activity-${esc(a.type)}"><span>${a.type === 'note_added' ? 'Private note' : a.type === 'created' ? 'Enquiry received' : a.type === 'stage_changed' ? 'Stage changed' : a.type === 'status_changed' ? 'Status changed' : 'Details updated'}</span><p>${esc(a.body)}</p><time datetime="${esc(a.created_at)}">${esc(date(a.created_at))}</time></li>`).join('') || '<li>No activity yet.</li>'}</ol>` : '<p>The activity history starts when you create the enquiry. Notes and stage changes stay with the record.</p>'}</aside></div>`;
  el<HTMLFormElement>('enquiry-editor').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    busy = true;
    lockDialog(true);
    const form = event.currentTarget as HTMLFormElement;
    const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    button.disabled = true;
    el('record-status').textContent = 'Saving…';
    const data = Object.fromEntries(new FormData(form));
    form.setAttribute('aria-busy', 'true');
    form
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        'input,textarea,select',
      )
      .forEach((control) => (control.disabled = true));
    try {
      const result = await api(
        record ? `enquiries/${record.id}` : 'enquiries',
        record ? 'PATCH' : 'POST',
        { ...data, ...(record ? { version: record.version } : {}) },
      );
      await load();
      await openRecord(result.enquiry.id);
      showStatus(record ? 'Enquiry updated.' : 'Opportunity created.');
    } catch (error) {
      const message = document.getElementById('record-status');
      if (message) message.textContent = (error as Error).message;
    } finally {
      busy = false;
      lockDialog(false);
      form.removeAttribute('aria-busy');
      form
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
          'input,textarea,select',
        )
        .forEach((control) => (control.disabled = false));
      button.disabled = false;
    }
  });
  if (record) {
    el('reload-record').addEventListener('click', () =>
      pending(el<HTMLButtonElement>('reload-record'), async () => {
        if (confirm('Reload this record? Unsaved edits will be discarded.'))
          await openRecord(record.id);
      }),
    );
    el<HTMLFormElement>('note-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      if (busy) return;
      busy = true;
      lockDialog(true);
      const form = event.currentTarget as HTMLFormElement,
        button = form.querySelector<HTMLButtonElement>('button')!;
      button.disabled = true;
      try {
        await api(`enquiries/${record.id}/notes`, 'POST', { body: new FormData(form).get('body') });
        form.reset();
        const result = await api(`enquiries/${record.id}`);
        const editor = el<HTMLFormElement>('enquiry-editor'),
          draft = Object.fromEntries(new FormData(editor));
        dialogContent(result.enquiry, result.activity);
        for (const [key, value] of Object.entries(draft)) {
          const control = el<HTMLFormElement>('enquiry-editor').elements.namedItem(
            key,
          ) as HTMLInputElement;
          if (control) control.value = String(value);
        }
        el('note-status').textContent = 'Note added.';
      } catch (error) {
        const message = document.getElementById('note-status');
        if (message) message.textContent = (error as Error).message;
      } finally {
        busy = false;
        lockDialog(false);
        button.disabled = false;
      }
    });
  }
}
async function openRecord(id: string) {
  const result = await api(`enquiries/${id}`);
  dialogContent(result.enquiry, result.activity);
  const dialog = el<HTMLDialogElement>('enquiry-dialog');
  if (!dialog.open) dialog.showModal();
}
el('new-enquiry').addEventListener('click', () => {
  dialogContent(null);
  el<HTMLDialogElement>('enquiry-dialog').showModal();
});
el('close-enquiry').addEventListener('click', () =>
  el<HTMLDialogElement>('enquiry-dialog').close(),
);
el('board-view').addEventListener('click', () => {
  view = 'board';
  render();
});
el('list-view').addEventListener('click', () => {
  view = 'list';
  render();
});
for (const id of ['customer-search', 'service-filter', 'status-filter', 'followup-filter'])
  el(id).addEventListener('input', render);
el('service-filter').innerHTML = '<option value="">All services</option>' + options(services);
el('refresh-enquiries').addEventListener('click', () =>
  pending(el<HTMLButtonElement>('refresh-enquiries'), () => load()),
);
el('load-more').addEventListener('click', () =>
  pending(el<HTMLButtonElement>('load-more'), () => load(true)),
);
el('sign-out').addEventListener('click', () =>
  pending(el<HTMLButtonElement>('sign-out'), async () => {
    await api('logout', 'POST', {});
    location.reload();
  }),
);
el('open-demo').addEventListener('click', () =>
  pending(el<HTMLButtonElement>('open-demo'), async () => {
    try {
      await enter(await api('demo', 'POST', {}));
    } catch (e) {
      el('login-status').textContent = (e as Error).message;
    }
  }),
);
el<HTMLFormElement>('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement,
    button = form.querySelector<HTMLButtonElement>('button')!;
  button.disabled = true;
  el('login-status').textContent = 'Signing in…';
  try {
    await enter(await api('login', 'POST', Object.fromEntries(new FormData(form))));
    form.reset();
    el('login-status').textContent = '';
  } catch (error) {
    el('login-status').textContent = (error as Error).message;
  } finally {
    button.disabled = false;
  }
});
async function init() {
  try {
    const config = await api('config');
    el('demo-access').hidden = config.mode !== 'demo';
    el('login-form').hidden = config.mode !== 'supabase';
    el('setup-needed').hidden = config.mode !== 'unconfigured';
    el('login-description').textContent =
      config.mode === 'demo'
        ? 'Try the customer flow before connecting your database.'
        : config.mode === 'supabase'
          ? 'Sign in with your authorised EFIops account.'
          : 'Dashboard setup is required.';
    if (config.mode !== 'unconfigured') {
      try {
        await enter(await api('session'));
      } catch (error) {
        if (!(error instanceof APIError) || error.status !== 401)
          el('login-status').textContent = (error as Error).message;
      }
    }
  } catch (error) {
    el('login-description').textContent = 'The dashboard server is unavailable.';
    el('login-status').textContent =
      'Use npm run build and npm run preview to run the dashboard backend.';
  }
}
init();
