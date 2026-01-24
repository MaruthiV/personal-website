interface TechTagProps {
  label: string
}

export function TechTag({ label }: TechTagProps) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground rounded">
      {label}
    </span>
  )
}
