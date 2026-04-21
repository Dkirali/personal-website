export function PastelBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full bg-pink-200/70 blur-3xl dark:bg-pink-500/10" />
      <div className="absolute top-32 right-0 h-[520px] w-[520px] rounded-full bg-indigo-200/70 blur-3xl dark:bg-indigo-500/10" />
      <div className="absolute bottom-0 left-1/3 h-[520px] w-[520px] rounded-full bg-amber-100/80 blur-3xl dark:bg-amber-500/10" />
      <div className="absolute bottom-20 right-10 h-[480px] w-[480px] rounded-full bg-emerald-100/80 blur-3xl dark:bg-emerald-500/10" />
    </div>
  );
}
