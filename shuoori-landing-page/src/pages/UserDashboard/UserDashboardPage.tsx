import Container from "../../components/common/Container"
import DashboardHeader from "../../components/UserDashboard/DashboardHeader"
import StatCard from "../../components/UserDashboard/StatCard"
import type { Locale } from "../../i18n"
import { copy } from "../../i18n"

type UserDashboardPageProps = {
  locale: Locale
}

const UserDashboardPage = ({ locale }: UserDashboardPageProps) => {
  const t = copy[locale].userDashboard

  return (
    <main className="py-10">
      <Container className="flex flex-col gap-10">
        <DashboardHeader title={t.title} subtitle={t.subtitle} />
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard title={t.cards.mood.title} value={t.cards.mood.value} />
          <StatCard title={t.cards.goals.title} value={t.cards.goals.value} />
          <StatCard title={t.cards.sessions.title} value={t.cards.sessions.value} />
        </section>
        <section className="flex flex-wrap gap-3">
          <button className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold leading-none text-primary-contrast">
            <span className="btn-label">{t.actions.primary}</span>
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-base font-semibold leading-none text-text-base">
            <span className="btn-label">{t.actions.secondary}</span>
          </button>
        </section>
      </Container>
    </main>
  )
}

export default UserDashboardPage
