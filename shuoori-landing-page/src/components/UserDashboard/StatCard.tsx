type StatCardProps = {
  title: string
  value: string
}

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <span className="text-sm text-text-muted">{title}</span>
      <span className="text-2xl font-semibold text-text-base">{value}</span>
    </div>
  )
}

export default StatCard
