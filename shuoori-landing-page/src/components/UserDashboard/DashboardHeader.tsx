type DashboardHeaderProps = {
  title: string
  subtitle: string
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold text-text-base">{title}</h1>
      <p className="text-base text-text-muted">{subtitle}</p>
    </div>
  )
}

export default DashboardHeader
