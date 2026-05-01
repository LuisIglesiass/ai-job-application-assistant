interface AnalyzeRequest {
  cv: string
  jobOffer: string
}

interface AnalyzeResponse {
  coverLetter: string
  matchScore: number
  reason: string
  strengths: string[]
  weaknesses: string[]
}

export default defineEventHandler(async (event): Promise<AnalyzeResponse> => {
  const body = await readBody<AnalyzeRequest>(event)

  if (!body?.cv || typeof body.cv !== 'string' || body.cv.trim() === '') {
    throw createError({ statusCode: 400, message: 'Field "cv" is required and must be a non-empty string.' })
  }

  if (!body?.jobOffer || typeof body.jobOffer !== 'string' || body.jobOffer.trim() === '') {
    throw createError({ statusCode: 400, message: 'Field "jobOffer" is required and must be a non-empty string.' })
  }

  return {
    coverLetter: `Sehr geehrte Damen und Herren,

mit großem Interesse habe ich Ihre Stellenausschreibung gelesen und bewerbe mich hiermit um die ausgeschriebene Position. Meine bisherige Berufserfahrung im Bereich Softwareentwicklung sowie meine fundierten Kenntnisse in modernen Web-Technologien machen mich zu einem geeigneten Kandidaten für diese Rolle.

In meinen bisherigen Projekten habe ich umfangreiche Erfahrungen mit agilen Entwicklungsmethoden gesammelt und erfolgreich in interdisziplinären Teams mitgewirkt. Dabei habe ich stets Wert auf sauberen, wartbaren Code und eine enge Zusammenarbeit mit den jeweiligen Fachabteilungen gelegt.

Ich freue mich auf die Möglichkeit, meine Fähigkeiten in Ihrem Unternehmen einzubringen und gemeinsam innovative Lösungen zu gestalten. Über eine Einladung zu einem persönlichen Gespräch würde ich mich sehr freuen.

Mit freundlichen Grüßen`,

    matchScore: 76,

    reason:
      'Das Profil deckt die wesentlichen Anforderungen der Stelle ab, insbesondere im Bereich der Webentwicklung und der Teamarbeit. Einige spezialisierte Kenntnisse fehlen jedoch, was den Score leicht mindert.',

    strengths: [
      'Solide Erfahrung mit modernen Web-Frameworks (Vue, React)',
      'Nachgewiesene Fähigkeit zur Arbeit in agilen Teams',
      'Klare Kommunikation und strukturierte Arbeitsweise',
      'Erfahrung mit CI/CD-Pipelines und DevOps-Grundlagen',
    ],

    weaknesses: [
      'Keine nachgewiesene Erfahrung mit dem geforderten Cloud-Provider (AWS)',
      'Kenntnisse im Bereich maschinelles Lernen nicht explizit belegt',
      'Fehlende Zertifizierungen, die in der Ausschreibung erwähnt werden',
    ],
  }
})
