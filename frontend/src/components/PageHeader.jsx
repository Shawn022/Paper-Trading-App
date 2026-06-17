function PageHeader({
    eyebrow,
    title,
    description,
    icon: Icon,
    action,
    meta
}) {
    return (
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                        {eyebrow}
                    </p>
                )}

                <div className="mt-2 flex items-center gap-3">
                    {Icon && (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
                            <Icon className="h-5 w-5" />
                        </div>
                    )}

                    <div className="min-w-0">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {meta && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                        {meta}
                    </div>
                )}
            </div>

            {action && (
                <div className="flex shrink-0 items-center gap-2">
                    {action}
                </div>
            )}
        </section>
    );
}

export default PageHeader;
