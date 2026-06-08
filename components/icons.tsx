export const SOCIAL: Record<string, JSX.Element> = {
  fb: <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M13.5 21v-8h2.2l.4-3h-2.6V8.1c0-.86.26-1.45 1.5-1.45H16V3.96C15.7 3.92 14.8 3.83 13.77 3.83c-2.17 0-3.66 1.32-3.66 3.76V10H7.9v3h2.21v8z"/></svg>,
  x: <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.5 3h2.7l-5.9 6.7L21.3 21h-5.4l-4.2-5.5L6.8 21H4.1l6.3-7.2L3 3h5.5l3.8 5.1zM16.6 19.4h1.5L7.5 4.5H5.9z"/></svg>,
  ig: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/></svg>,
  in: <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.4 8.5h3.1V21H3.4zM9.1 8.5h2.97v1.7h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H9.1z"/></svg>,
};
const I = ({ d }: { d: JSX.Element }) => <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
export const SPEC = {
  year: <I d={<><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></>} />,
  mileage: <I d={<><path d="M4 17a8 8 0 0 1 16 0"/><path d="M12 17l4.5-4.5"/><circle cx="12" cy="17" r="1.2"/></>} />,
  gear: <I d={<><path d="M7 5v14M7 12h6a4 4 0 0 0 4-4V5M17 12v4"/><circle cx="7" cy="5" r="1.4"/><circle cx="7" cy="19" r="1.4"/><circle cx="17" cy="5" r="1.4"/></>} />,
  fuel: <I d={<><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14"/><path d="M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3"/><path d="M7 8h6"/></>} />,
};
