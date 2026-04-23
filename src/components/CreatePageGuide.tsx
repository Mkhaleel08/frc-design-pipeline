'use client';

import { STAGE_COLORS, STAGES, PHASE_COLORS, BUILD_PHASES, SUBTEAM_COLORS } from './types';

const STEPS = [
  {
    num: '01',
    title: 'Title & Description',
    desc: 'Give your request a clear, descriptive title. Add context in the description so the assigned team understands exactly what is needed.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Set Priority & Sub-Team',
    desc: 'Choose a priority level (High/Medium/Low). Select the relevant sub-team to route the request to the right people.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3m6 3v6m4-4v6m-11 5H5a2 2 0 01-2-2V6a2 2 0 012-2h9l4 4v9a2 2 0 01-2 2h-1" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Fill Sub-Team Fields',
    desc: 'Depending on the sub-team, additional fields appear: weight/machine for CAD, wiring/parts for Electrical, subsystem for Programming, etc.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Assign & Set Due Date',
    desc: 'Assign the task to a specific person and set a due date. Optionally link a dependency or mark the task as blocked with a reason.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Submit & Track',
    desc: 'Submit the request. It will appear in the Submitted column. Track its progress through Assigned, In Progress, Review, Fabrication, and finally Complete.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

const SUBTEAM_TIPS: Record<string, { tip: string; fields: string[] }> = {
  CAD: {
    tip: 'Provide CAD files, weight estimates, and machine/tool requirements. Specify the manufacturing status as tasks progress through CAD → CAM → Cut → Assembly.',
    fields: ['Manufacturing Status', 'Machine Required', 'Weight Estimate'],
  },
  Mechanical: {
    tip: 'Include tolerance specifications, material requirements, and assembly notes. Link related CAD files when available.',
    fields: ['Manufacturing Status', 'Machine Required', 'Weight Estimate'],
  },
  Electrical: {
    tip: 'Track wiring status from Planned → Routed → Crimped → Tested. Note when components arrive and flag any issues early.',
    fields: ['Wiring Status', 'Parts Received'],
  },
  Programming: {
    tip: 'Specify the target subsystem. Mark when code is tested on the robot. Link to code repository or documentation.',
    fields: ['Subsystem', 'Tested on Robot'],
  },
  Business: {
    tip: 'Track budget, sponsorship status, and team communications. Include timeline and cost estimates where relevant.',
    fields: ['Budget Notes', 'Sponsorship Status'],
  },
  Strategy: {
    tip: 'Document game analysis, match strategy, and scouting reports. Attach any relevant data or simulation files.',
    fields: ['Strategy Document', 'Scouting Data'],
  },
};

export function CreatePageGuide() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">How to Create a Request</h2>
        </div>
        <div className="space-y-4">
          {STEPS.map((step) => (
            <div key={step.num} className="flex gap-4 group">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)] group-hover:shadow-[0_0_12px_var(--accent-glow)] transition-all">
                {step.icon}
                <span className="absolute -top-1 -right-1 text-[8px] font-bold text-[var(--accent)] bg-[var(--accent)] text-black w-4 h-4 rounded-full flex items-center justify-center">{step.num}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">{step.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-[var(--cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Sub-Team Quick Reference</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(SUBTEAM_TIPS).map(([team, data]) => (
            <div key={team} className="glass-light rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: SUBTEAM_COLORS[team as keyof typeof SUBTEAM_COLORS] }}
                ></span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{team}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-2 leading-relaxed">{data.tip}</p>
              <div className="flex flex-wrap gap-1">
                {data.fields.map((field) => (
                  <span key={field} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[var(--surface-3)] text-[var(--text-secondary)]">
                    {field}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-[var(--purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Task Lifecycle</h2>
        </div>
        <div className="relative">
          <div className="flex items-center justify-between overflow-x-auto scroll-hide pb-2">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex flex-col items-center min-w-[80px]">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 text-white text-xs font-bold shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${STAGE_COLORS[stage]}, ${STAGE_COLORS[stage]}80)`,
                    boxShadow: `0 4px 12px ${STAGE_COLORS[stage]}40`,
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: STAGE_COLORS[stage] }}>
                  {stage}
                </span>
                {i < STAGES.length - 1 && (
                  <div className="absolute top-[18px] left-[88px] right-[88px] h-px bg-gradient-to-r from-[var(--glass-border)] via-[var(--accent)] to-[var(--glass-border)]" style={{ display: 'none' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: STAGE_COLORS[stage] }}
                ></div>
                {i < STAGES.length - 1 && (
                  <div className="w-6 h-px bg-[var(--glass-border)]"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Build Phases</h2>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {BUILD_PHASES.map((phase) => (
            <div key={phase} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--glass-border)]">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: PHASE_COLORS[phase] }}
              ></div>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {phase === 'Shape' ? 'Shape' :
                 phase === 'BuildCycle1' ? 'Build Cycle 1' :
                 phase === 'BuildCycle2' ? 'Build Cycle 2' :
                 phase === 'Cooldown' ? 'Cooldown' :
                 'Parking Lot'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}