import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MessageSquare } from "lucide-react"
import { ProjectArtifact } from "@/components/artifact"
import { PROJECTS, getProject } from "@/lib/projects"

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = getProject((await params).id)
  return p ? { title: `${p.title} · Jules Moreau`, description: p.summary } : {}
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const project = getProject((await params).id)
  if (!project) notFound()
  return (
    <div className="page-wrap">
      <div className="page-top">
        <Link href="/" className="brand" style={{ padding: 0, textDecoration: "none" }}>
          <span className="brand-mark" aria-hidden>M</span>
          <span className="brand-name">Moreau Harness</span>
        </Link>
        <span style={{ flex: 1 }} />
        <Link className="chip-btn solid" href={`/?project=${project.id}`}>
          <MessageSquare size={14} aria-hidden /> Ask my AI double about it
        </Link>
      </div>
      <ProjectArtifact project={project} />
    </div>
  )
}
