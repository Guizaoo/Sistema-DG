function AdminPlaceholder({ activeRoute }) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-zinc-900/85 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
          Area administrativa
        </span>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">
          {activeRoute.title}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-300">
          {activeRoute.description}
        </p>
      </section>

      <section className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-sm font-black text-amber-200">
          DG
        </div>
        <h3 className="text-lg font-semibold">Modulo pronto para construir</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-400">
          Aqui vamos colocar as funcionalidades reais do administrador quando
          formos desenvolver esta parte.
        </p>
      </section>
    </div>
  )
}

export default AdminPlaceholder
