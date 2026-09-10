import type { Client } from "@/types/client"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"

interface SummarySection {
  title: string
  text: string
}

function buildSections(client: Client): SummarySection[] {
  const sections: SummarySection[] = []
  if (client.presentingConcerns) sections.push({ title: "Presenting Concerns", text: client.presentingConcerns })
  if (client.diagnosis) sections.push({ title: "Diagnosis", text: client.diagnosis })
  if (client.treatmentGoals) sections.push({ title: "Treatment Goals", text: client.treatmentGoals })
  if (client.clinicalSummary) sections.push({ title: "Clinical Summary", text: client.clinicalSummary })
  if (client.referralSource) sections.push({ title: "Referral Source", text: client.referralSource })
  if (client.generalNotes) sections.push({ title: "General Notes", text: client.generalNotes })
  return sections
}

export function ClientSummary({ client }: { client: Client }) {
  const sections = buildSections(client)

  if (sections.length === 0) {
    return (
      <Card>
        <CardHeader title="Clinical summary" />
        <CardBody>
          <p className="text-sm text-slate-500">No clinical summary recorded yet.</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <section>
      <Card>
        <CardHeader title="Clinical summary" />
        <CardBody className="space-y-5">
          {sections.map((section) => (
            <div key={section.title} className="break-words">
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {section.title}
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {section.text}
              </p>
            </div>
          ))}
        </CardBody>
      </Card>
    </section>
  )
}