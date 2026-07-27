"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowDown, ArrowUp, AlertCircle, Check, Eye, EyeOff, ImagePlus, Plus, RefreshCw, Save, Trash2, Upload, Video, Database, AlertTriangle } from "lucide-react"
import {
  SECTION_CONFIG_BY_KEY,
  SECTION_KEYS,
  createDefaultItem,
  emptyLocalized,
  type FieldType,
  type ItemField,
  type LocalizedText,
  type SectionConfig,
} from "@/lib/section-config"
import initialSections from "@/data/initial-sections.json"

type SectionMedia = {
  url: string
  alt: LocalizedText
  key: string
}

type SectionItem = Record<string, unknown>

type Section = {
  _id?: string
  key: string
  title: LocalizedText
  subtitle: LocalizedText
  body: LocalizedText
  images: SectionMedia[]
  items: SectionItem[]
  order: number
  isPublished: boolean
}

const sectionSeeds = initialSections as Section[]

function normalizeLocalized(value: unknown): LocalizedText {
  if (value && typeof value === "object") {
    const localized = value as Partial<LocalizedText>
    return {
      en: typeof localized.en === "string" ? localized.en : "",
      ar: typeof localized.ar === "string" ? localized.ar : "",
    }
  }

  return emptyLocalized()
}

function normalizeMedia(media: Partial<SectionMedia>): SectionMedia {
  return {
    url: media.url ?? "",
    key: media.key ?? "",
    alt: normalizeLocalized(media.alt),
  }
}

function normalizeSection(section: Partial<Section>, index: number): Section {
  return {
    key: section.key ?? `section-${index + 1}`,
    title: normalizeLocalized(section.title),
    subtitle: normalizeLocalized(section.subtitle),
    body: normalizeLocalized(section.body),
    images: Array.isArray(section.images) ? section.images.map(normalizeMedia) : [],
    items: Array.isArray(section.items) ? (section.items as SectionItem[]) : [],
    order: typeof section.order === "number" ? section.order : index,
    isPublished: Boolean(section.isPublished),
    _id: section._id,
  }
}

function itemSummary(item: SectionItem, config: SectionConfig, index: number) {
  const primaryField = config.fields.find((field) => ["title", "label", "name", "question"].includes(field.name)) ?? config.fields[0]
  const value = primaryField ? item[primaryField.name] : undefined

  if (value && typeof value === "object" && "en" in value) {
    return String((value as LocalizedText).en || (value as LocalizedText).ar || `${config.itemLabel} ${index + 1}`)
  }

  if (typeof value === "string" && value) return value

  return `${config.itemLabel} ${index + 1}`
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)
}

function previewUrl(url: string) {
  if (!url) return ""
  if (/^(https?:)?\/\//i.test(url)) return url
  const path = url.startsWith("/") ? url : `/${url}`
  return `http://localhost:5173${path}`
}

function visibleFields(config: SectionConfig, item: SectionItem) {
  const kind = typeof item.kind === "string" ? item.kind : ""

  return config.fields.filter((field) => {
    if (field.hidden) return false
    if (config.key === "hero" && kind === "cta") return !["value", "suffix", "decimals"].includes(field.name)
    if (config.key === "hero" && kind === "stat") return !["href"].includes(field.name)
    if (config.key === "hero" && kind && !["cta", "stat"].includes(kind)) return field.name === "label"
    return true
  })
}

export default function AdminDashboard() {
  const [sections, setSections] = useState<Section[]>([])
  const [savedSections, setSavedSections] = useState<Section[]>([])
  const [selectedKey, setSelectedKey] = useState<string>(SECTION_KEYS[0])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true)
  const [message, setMessage] = useState("")
  const [deletingRowIndex, setDeletingRowIndex] = useState<number | null>(null)

  const orderedSections = useMemo(
    () =>
      SECTION_KEYS.map((key) => sections.find((section) => section.key === key)).filter(
        (section): section is Section => Boolean(section)
      ),
    [sections]
  )
  const selectedIndex = sections.findIndex((section) => section.key === selectedKey)
  const selected = selectedIndex >= 0 ? sections[selectedIndex] : orderedSections[0]
  const selectedConfig = selected ? SECTION_CONFIG_BY_KEY[selected.key] : undefined

  const savedSelected = useMemo(
    () => savedSections.find((s) => s.key === selectedKey),
    [savedSections, selectedKey]
  )

  const hasUnsavedChanges = useMemo(() => {
    if (!selected || !savedSelected) return false
    return JSON.stringify(selected) !== JSON.stringify(savedSelected)
  }, [selected, savedSelected])

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(""), 4500)
    return () => clearTimeout(timer)
  }, [message])

  useEffect(() => {
    fetchSections()
    window.addEventListener("focus", fetchSections)

    return () => window.removeEventListener("focus", fetchSections)
  }, [])

  async function fetchSections() {
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/sections", { cache: "no-store" })
      const payload = await response.json()

      if (!response.ok) throw new Error(payload.error || "Failed to load sections")

      const loaded = (payload.sections as Partial<Section>[]).map(normalizeSection)
      const merged = SECTION_KEYS.map((key, index) => {
        const existing = loaded.find((section) => section.key === key)
        const seed = sectionSeeds.find((section) => section.key === key)
        return existing ?? normalizeSection(seed ?? { key, order: index }, index)
      })

      setSections(merged)
      setSavedSections(JSON.parse(JSON.stringify(merged)))
      setIsDbConnected(true)
      setSelectedKey((current) => (merged.some((section) => section.key === current) ? current : merged[0]?.key ?? SECTION_KEYS[0]))
    } catch (error) {
      const fallback = SECTION_KEYS.map((key, index) => normalizeSection(sectionSeeds.find((section) => section.key === key) ?? { key, order: index }, index))
      setSections(fallback)
      setSavedSections(JSON.parse(JSON.stringify(fallback)))
      setIsDbConnected(false)
      setSelectedKey(fallback[0]?.key ?? SECTION_KEYS[0])

      let friendlyMessage = "Failed to load sections."
      if (error instanceof Error) {
        if (error.message.includes("Unexpected token") || error.message.includes("is not valid JSON")) {
          friendlyMessage = "API server offline or restarting. Loaded offline fallback data."
        } else {
          friendlyMessage = error.message
        }
      }
      setMessage(friendlyMessage)
    } finally {
      setIsLoading(false)
    }
  }

  function updateSelected(patch: Partial<Section>) {
    if (!selected) return
    setSections((current) => current.map((section) => (section.key === selected.key ? { ...section, ...patch } : section)))
  }

  function updateLocalized(field: "title" | "subtitle" | "body", locale: keyof LocalizedText, value: string) {
    if (!selected) return
    updateSelected({
      [field]: {
        ...selected[field],
        [locale]: value,
      },
    })
  }

  function updateItem(itemIndex: number, field: string, value: unknown) {
    if (!selected) return
    updateSelected({
      items: selected.items.map((item, index) => (index === itemIndex ? { ...item, [field]: value } : item)),
    })
  }

  function addItem() {
    if (!selected) return
    updateSelected({ items: [...selected.items, createDefaultItem(selected.key)] })
  }

  function confirmRemoveItem(itemIndex: number) {
    if (!selected) return
    updateSelected({ items: selected.items.filter((_, index) => index !== itemIndex) })
    setDeletingRowIndex(null)
  }

  function removeItem(itemIndex: number) {
    setDeletingRowIndex(itemIndex)
  }

  function moveItem(itemIndex: number, direction: -1 | 1) {
    if (!selected) return
    const nextIndex = itemIndex + direction

    if (nextIndex < 0 || nextIndex >= selected.items.length) return

    const nextItems = [...selected.items]
    const current = nextItems[itemIndex]
    nextItems[itemIndex] = nextItems[nextIndex]
    nextItems[nextIndex] = current
    updateSelected({ items: nextItems })
  }

  async function saveSelected() {
    if (!selected) return
    setIsSaving(true)
    setMessage("")

    try {
      const payload = {
        key: selected.key,
        title: selected.title,
        subtitle: selected.subtitle,
        body: selected.body,
        images: selected.images,
        items: selected.items,
        order: selected.order,
        isPublished: selected.isPublished,
      }
      const response = await fetch(selected._id ? `/api/admin/sections/${selected._id}` : "/api/admin/sections", {
        method: selected._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) throw new Error(result.error || "Failed to save section")

      const saved = normalizeSection(result.section, selected.order)
      setSections((current) => current.map((section) => (section.key === saved.key ? saved : section)))
      setSavedSections((current) => current.map((section) => (section.key === saved.key ? saved : section)))
      setSelectedKey(saved.key)
      setIsDbConnected(true)
      setMessage("Saved changes successfully!")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save section")
    } finally {
      setIsSaving(false)
    }
  }

  async function uploadMediaSlot(file: File, mediaIndex: number) {
    if (!selected) return

    const formData = new FormData()
    formData.append("sectionKey", selected.key)
    formData.append("file", file)

    setMessage("Uploading file...")
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    })
    const result = await response.json()

    if (!response.ok) {
      setMessage(result.error || "Upload failed")
      return
    }

    const nextImages = [...selected.images]
    while (nextImages.length <= mediaIndex) {
      nextImages.push({ url: "", key: "", alt: { en: "", ar: "" } })
    }
    nextImages[mediaIndex] = {
      url: result.url,
      key: result.key,
      alt: { en: file.name, ar: "" },
    }

    updateSelected({ images: nextImages })
    const slotLabel = selectedConfig?.mediaLabels?.[mediaIndex] || `Media ${mediaIndex + 1}`
    setMessage(`Uploaded file to ${slotLabel}. Click 'Save changes' to persist.`)
  }

  async function clearMediaSlot(mediaIndex: number) {
    if (!selected) return
    const media = selected.images[mediaIndex]

    if (media?.key && !media.key.startsWith("legacy/")) {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: media.key }),
      }).catch(() => undefined)
    }

    const nextImages = [...selected.images]
    if (mediaIndex < nextImages.length) {
      nextImages[mediaIndex] = { url: "", key: "", alt: { en: "", ar: "" } }
    }

    updateSelected({ images: nextImages })
    const slotLabel = selectedConfig?.mediaLabels?.[mediaIndex] || `Media ${mediaIndex + 1}`
    setMessage(`Cleared media for ${slotLabel}. Click 'Save changes' to apply.`)
  }

  function updateMediaField(mediaIndex: number, field: "url" | "alt_en" | "alt_ar", value: string) {
    if (!selected) return
    const nextImages = [...selected.images]
    while (nextImages.length <= mediaIndex) {
      nextImages.push({ url: "", key: "", alt: { en: "", ar: "" } })
    }

    if (field === "url") {
      nextImages[mediaIndex] = { ...nextImages[mediaIndex], url: value }
    } else if (field === "alt_en") {
      nextImages[mediaIndex] = {
        ...nextImages[mediaIndex],
        alt: { ...nextImages[mediaIndex].alt, en: value },
      }
    } else if (field === "alt_ar") {
      nextImages[mediaIndex] = {
        ...nextImages[mediaIndex],
        alt: { ...nextImages[mediaIndex].alt, ar: value },
      }
    }

    updateSelected({ images: nextImages })
  }

  return (
    <main className="min-h-screen bg-[#FAF9F5] text-ink font-sans">
      <div className="grid min-h-screen w-full grid-cols-[320px_minmax(0,1fr)] gap-8 px-8 py-8">
        <aside className="sticky top-8 flex h-[calc(100vh-64px)] flex-col overflow-hidden rounded-2xl border border-[#E4E6EA]/80 bg-white shadow-[0_12px_36px_rgba(16,24,39,0.03)]">
          <div className="border-b border-[#E4E6EA]/80 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-tr from-[#2EB8AA] via-[#EC4899] to-[#F59E0B] p-[1.5px] shadow-sm">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <img
                      src="http://localhost:5173/logo.svg"
                      className="h-5 w-5 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232EB8AA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                      }}
                      alt=""
                    />
                  </div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1B7C72]">Shuoori CMS</span>
              </div>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E6EA] bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-800 shadow-sm"
                onClick={fetchSections}
                type="button"
                aria-label="Refresh sections"
                title="Refresh database connection"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-[#2EB8AA]" : ""}`} />
              </button>
            </div>
            <h1 className="mt-5 font-serif text-[28px] font-semibold tracking-tight text-[#101827] leading-none">Landing Editor</h1>
            <p className="mt-2 text-xs leading-relaxed text-[#8C95A3] font-medium">Manage existing landing page content, media, and publish state.</p>

            <div className="mt-4 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${isDbConnected ? "bg-teal-50 text-teal-700 border border-teal-200/60" : "bg-amber-50 text-amber-800 border border-amber-200/60"}`}>
                <Database className="h-3 w-3" />
                {isDbConnected ? "Live DB Connected" : "Offline Seed Mode"}
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-4 custom-scrollbar">
            {isLoading ? <p className="p-3 text-xs text-muted font-medium">Loading sections...</p> : null}
            <div className="flex flex-col gap-1.5">
              {orderedSections.map((section) => {
                const isActive = selected?.key === section.key
                const config = SECTION_CONFIG_BY_KEY[section.key]

                return (
                  <button
                    type="button"
                    key={section.key}
                    onClick={() => setSelectedKey(section.key)}
                    className={`group flex items-center justify-between rounded-xl px-4 py-3 text-left transition ${isActive
                        ? "bg-[#EAF7F5] text-[#14766E] shadow-sm font-semibold"
                        : "text-[#4A5462] hover:bg-[#FAF9F5] hover:text-[#101827]"
                      }`}
                  >
                    <div>
                      <p className="font-serif text-sm font-medium leading-snug">{config?.label ?? section.key}</p>
                      <p className="text-[11px] text-[#8C95A3] font-normal line-clamp-1 mt-0.5">{config?.description}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${section.isPublished
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${section.isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {section.isPublished ? "Live" : "Draft"}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-8">
          {selected && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E6EA]/60 pb-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1B7C72]">Editing Section</p>
                  <h2 className="mt-1 font-serif text-4xl font-semibold tracking-tight text-[#101827]">
                    {selectedConfig?.label ?? selected.key}
                  </h2>
                  <p className="mt-1 text-xs text-[#8C95A3] font-medium">{selectedConfig?.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-3 rounded-full border border-[#E4E6EA]/80 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4A5462] shadow-sm transition hover:border-[#2EB8AA]/40">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${selected.isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {selected.isPublished ? "Published" : "Draft"}
                    </span>
                    <div className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected.isPublished}
                        onChange={(e) => updateSelected({ isPublished: e.target.checked })}
                      />
                      <div className={`h-5 w-9 rounded-full transition-colors ${selected.isPublished ? "bg-[#2EB8AA]" : "bg-slate-200"}`} />
                      <div className={`absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${selected.isPublished ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </label>

                  <button
                    className={`inline-flex h-11 items-center gap-2 rounded-xl px-6 text-xs font-bold uppercase tracking-wider text-white transition shadow-md ${hasUnsavedChanges
                        ? "bg-[#C86B4D] hover:bg-[#b05a3d] ring-2 ring-[#C86B4D]/30"
                        : "bg-[#101827] hover:bg-black"
                      }`}
                    onClick={saveSelected}
                    type="button"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : hasUnsavedChanges ? (
                      <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {isSaving ? "Saving..." : hasUnsavedChanges ? "Save Unsaved Changes" : "Save changes"}
                  </button>
                </div>
              </div>

              <div className="grid min-h-0 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <div className="flex flex-col gap-6">
                  <Panel title="Page Text" eyebrow={selectedConfig?.label ?? selected.key}>
                    <div className="grid gap-5 md:grid-cols-2">
                      <TextField label={`${selectedConfig?.copyLabels?.title ?? "Title"} EN`} value={selected.title.en} onChange={(value) => updateLocalized("title", "en", value)} />
                      <TextField label={`${selectedConfig?.copyLabels?.title ?? "Title"} AR`} value={selected.title.ar} onChange={(value) => updateLocalized("title", "ar", value)} dir="rtl" />
                      <TextField label={`${selectedConfig?.copyLabels?.subtitle ?? "Subtitle"} EN`} value={selected.subtitle.en} onChange={(value) => updateLocalized("subtitle", "en", value)} />
                      <TextField label={`${selectedConfig?.copyLabels?.subtitle ?? "Subtitle"} AR`} value={selected.subtitle.ar} onChange={(value) => updateLocalized("subtitle", "ar", value)} dir="rtl" />
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <TextArea label={`${selectedConfig?.copyLabels?.body ?? "Body"} EN`} value={selected.body.en} onChange={(value) => updateLocalized("body", "en", value)} />
                      <TextArea label={`${selectedConfig?.copyLabels?.body ?? "Body"} AR`} value={selected.body.ar} onChange={(value) => updateLocalized("body", "ar", value)} dir="rtl" />
                    </div>
                  </Panel>

                  <Panel
                    title={selectedConfig?.itemLabel ? `${selectedConfig.itemLabel}s` : "Items"}
                    eyebrow={selected.key === "header" ? "Landing page rows" : "Repeatable rows"}
                    action={
                      selectedConfig ? (
                        <button
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#101827] hover:bg-black px-4 text-xs font-bold uppercase tracking-wider text-white transition shadow-sm"
                          type="button"
                          onClick={addItem}
                        >
                          <Plus className="h-4 w-4" />
                          Add row
                        </button>
                      ) : null
                    }
                  >
                    {selectedConfig ? (
                      <div className="flex flex-col gap-5">
                        {selected.items.map((item, itemIndex) => (
                          <div className="rounded-2xl border border-[#E4E6EA]/80 bg-[#FAF9F6] p-5 shadow-sm" key={itemIndex}>
                            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#E4E6EA]/40 pb-4">
                              <div>
                                <p className="font-serif text-base font-semibold text-[#101827]">
                                  {itemSummary(item, selectedConfig, itemIndex)}
                                </p>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C95A3] mt-0.5">
                                  Row {itemIndex + 1}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <IconButton label="Move row up" onClick={() => moveItem(itemIndex, -1)} icon={<ArrowUp className="h-3.5 w-3.5" />} />
                                <IconButton label="Move row down" onClick={() => moveItem(itemIndex, 1)} icon={<ArrowDown className="h-3.5 w-3.5" />} />
                                {deletingRowIndex === itemIndex ? (
                                  <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                                    <button
                                      type="button"
                                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-red-600 rounded hover:bg-red-700"
                                      onClick={() => confirmRemoveItem(itemIndex)}
                                    >
                                      Confirm Delete
                                    </button>
                                    <button
                                      type="button"
                                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900"
                                      onClick={() => setDeletingRowIndex(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <IconButton label="Remove row" onClick={() => setDeletingRowIndex(itemIndex)} icon={<Trash2 className="h-3.5 w-3.5" />} tone="danger" />
                                )}
                              </div>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2">
                              {visibleFields(selectedConfig, item).map((field) => (
                                <ItemFieldEditor key={field.name} field={field} item={item} onChange={(value) => updateItem(itemIndex, field.name, value)} />
                              ))}
                            </div>
                          </div>
                        ))}
                        {selected.items.length === 0 ? (
                          <p className="rounded-xl border border-dashed border-[#D9DDE3] bg-[#FAF9F6] p-6 text-center text-xs font-semibold text-slate-400">
                            No repeatable rows yet. Click "Add row" to create one.
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-slate-400">No configured editor for this fixed section.</p>
                    )}
                  </Panel>
                </div>

                <div className="flex flex-col gap-6">
                  {selectedConfig?.mediaLabels && selectedConfig.mediaLabels.length > 0 ? (
                    <Panel
                      title="Images and Videos"
                      eyebrow="Landing page assets"
                    >
                      <div className="flex flex-col gap-5">
                        {selectedConfig.mediaLabels.map((slotLabel, mediaIndex) => {
                          const media = selected.images[mediaIndex] || { url: "", key: "", alt: { en: "", ar: "" } }
                          const resolvedPreviewUrl = previewUrl(media.url)
                          const hasAsset = Boolean(media.url)

                          return (
                            <div className="rounded-2xl border border-[#E4E6EA]/80 bg-[#FAF9F6] p-4 shadow-sm" key={`${slotLabel}-${mediaIndex}`}>
                              <div className="flex items-center justify-between border-b border-[#E4E6EA]/40 pb-3 mb-3">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#101827]">
                                  {isVideoUrl(media.url) ? <Video className="h-4 w-4 text-[#1B7C72]" /> : <ImagePlus className="h-4 w-4 text-[#1B7C72]" />}
                                  {slotLabel}
                                </div>
                                <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-[#101827] hover:bg-black px-3 text-[10px] font-bold uppercase tracking-wider text-white transition shadow-sm">
                                  <Upload className="h-3 w-3" />
                                  {hasAsset ? "Replace File" : "Upload File"}
                                  <input
                                    className="hidden"
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(event) => event.target.files?.[0] && uploadMediaSlot(event.target.files[0], mediaIndex)}
                                  />
                                </label>
                              </div>

                              <div className="overflow-hidden rounded-xl border border-[#E4E6EA]/80 bg-[#101827] flex items-center justify-center p-2 h-48 shadow-inner">
                                {isVideoUrl(media.url) ? (
                                  <video
                                    className="h-full w-full object-contain rounded-lg"
                                    src={resolvedPreviewUrl ? (resolvedPreviewUrl.includes("#t=") ? resolvedPreviewUrl : `${resolvedPreviewUrl}#t=0.001`) : ""}
                                    controls
                                    muted
                                    preload="metadata"
                                    playsInline
                                  />
                                ) : media.url ? (
                                  <img className="h-full max-h-full max-w-full object-contain" src={resolvedPreviewUrl} alt={media.alt.en || slotLabel} />
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-center p-4">
                                    <ImagePlus className="h-8 w-8 text-slate-300 mb-2" />
                                    <p className="text-xs font-semibold text-slate-400">No media asset set for {slotLabel}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Upload a file or enter a File URL below</p>
                                  </div>
                                )}
                              </div>

                              <div className="mt-3.5 space-y-3.5">
                                <TextField
                                  label="File URL"
                                  value={media.url}
                                  placeholder="e.g. /logo.svg or https://..."
                                  onChange={(value) => updateMediaField(mediaIndex, "url", value)}
                                />
                                {hasAsset ? (
                                  <div className="grid gap-3.5 sm:grid-cols-2">
                                    <TextField
                                      label="Alt EN"
                                      value={media.alt.en}
                                      placeholder="English description"
                                      onChange={(value) => updateMediaField(mediaIndex, "alt_en", value)}
                                    />
                                    <TextField
                                      label="Alt AR"
                                      value={media.alt.ar}
                                      dir="rtl"
                                      placeholder="الوصف بالعربية"
                                      onChange={(value) => updateMediaField(mediaIndex, "alt_ar", value)}
                                    />
                                  </div>
                                ) : null}
                              </div>

                              {hasAsset ? (
                                <button
                                  className="mt-4 inline-flex h-8 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white hover:bg-red-50 text-[11px] font-bold uppercase tracking-wider text-red-600 shadow-sm transition"
                                  type="button"
                                  onClick={() => clearMediaSlot(mediaIndex)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Clear Media
                                </button>
                              ) : null}
                            </div>
                          )
                        })}
                      </div>
                    </Panel>
                  ) : null}

                  <Panel title="Status" eyebrow="Save state">
                    <p className="text-xs font-medium leading-relaxed text-[#8C95A3]">
                      Public API returns only published sections. This editor manages fixed landing sections only, so page structure stays aligned with the current React design.
                    </p>
                    {message ? (
                      <div className="mt-4 flex items-center justify-between rounded-xl border border-teal-200 bg-[#E0F7F4] px-4 py-3 text-xs font-semibold text-[#14766E] shadow-sm animate-fade-in">
                        <span className="flex items-center gap-2">
                          <Check className="h-4 w-4 flex-shrink-0 text-teal-600" />
                          {message}
                        </span>
                        <button
                          type="button"
                          className="text-[10px] uppercase font-bold text-teal-700 hover:text-teal-900"
                          onClick={() => setMessage("")}
                        >
                          Dismiss
                        </button>
                      </div>
                    ) : null}
                  </Panel>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

function Panel({ title, eyebrow, action, children }: { title: string; eyebrow?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E4E6EA]/80 bg-white p-6 shadow-[0_4px_24px_rgba(16,24,39,0.02)]">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          {eyebrow ? <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C95A3]">{eyebrow}</p> : null}
          <h3 className="mt-1 font-serif text-2xl font-semibold text-[#101827]">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function IconButton({ label, icon, onClick, tone = "neutral" }: { label: string; icon: React.ReactNode; onClick: () => void; tone?: "neutral" | "danger" }) {
  return (
    <button
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white shadow-sm transition ${tone === "danger"
          ? "border-red-100 text-red-600 hover:bg-red-50"
          : "border-[#E4E6EA] text-[#4A5462] hover:bg-slate-50 hover:text-[#101827]"
        }`}
      onClick={onClick}
      type="button"
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  )
}

function ItemFieldEditor({ field, item, onChange }: { field: ItemField; item: SectionItem; onChange: (value: unknown) => void }) {
  const value = item[field.name]

  if (field.type === "localized" || field.type === "localizedTextarea") {
    const localizedValue = normalizeLocalized(value)
    const Component = field.type === "localizedTextarea" ? TextArea : TextField

    return (
      <>
        <Component label={`${field.label} EN`} value={localizedValue.en} onChange={(nextValue) => onChange({ ...localizedValue, en: nextValue })} />
        <Component label={`${field.label} AR`} value={localizedValue.ar} onChange={(nextValue) => onChange({ ...localizedValue, ar: nextValue })} dir="rtl" />
      </>
    )
  }

  if (field.type === "localizedList") {
    const list = Array.isArray(value) ? (value as LocalizedText[]).map(normalizeLocalized) : []

    return (
      <div className="md:col-span-2">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6A727F]">{field.label}</p>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E4E6EA] bg-white px-3 text-xs font-bold uppercase tracking-wider text-[#4A5462] hover:bg-slate-50 hover:text-[#101827] shadow-sm transition"
            onClick={() => onChange([...list, emptyLocalized()])}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {list.map((entry, index) => (
            <div className="grid gap-3.5 rounded-xl border border-[#E4E6EA]/80 bg-white p-3.5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_36px]" key={index}>
              <input
                className="h-11 rounded-xl border border-[#E4E6EA]/80 bg-[#FAF9F6] px-4 text-sm font-normal text-[#101827] outline-none transition focus:border-[#2EB8AA] focus:ring-2 focus:ring-[#2EB8AA]/10"
                value={entry.en}
                placeholder="English"
                onChange={(event) => onChange(list.map((item, itemIndex) => (itemIndex === index ? { ...item, en: event.target.value } : item)))}
              />
              <input
                className="h-11 rounded-xl border border-[#E4E6EA]/80 bg-[#FAF9F6] px-4 text-sm font-normal text-[#101827] outline-none transition focus:border-[#2EB8AA] focus:ring-2 focus:ring-[#2EB8AA]/10"
                dir="rtl"
                value={entry.ar}
                placeholder="العربية"
                onChange={(event) => onChange(list.map((item, itemIndex) => (itemIndex === index ? { ...item, ar: event.target.value } : item)))}
              />
              <IconButton label="Remove feature" onClick={() => onChange(list.filter((_, itemIndex) => itemIndex !== index))} icon={<Trash2 className="h-4 w-4" />} tone="danger" />
            </div>
          ))}
          {list.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#D9DDE3] bg-white p-4 text-center text-xs font-semibold text-slate-400">
              No features added yet.
            </p>
          ) : null}
        </div>
      </div>
    )
  }

  if (field.type === "checkbox") {
    const isChecked = Boolean(value)
    return (
      <label className="flex h-12 cursor-pointer select-none items-center justify-between gap-4 rounded-xl border border-[#E4E6EA]/80 bg-[#FAF9F6] px-4 text-sm font-semibold text-slate-700 transition hover:border-[#2EB8AA]/30">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6A727F]">{field.label}</span>
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            className="sr-only"
            checked={isChecked}
            onChange={(event) => onChange(event.target.checked)}
          />
          <div className={`h-5 w-9 rounded-full transition-colors ${isChecked ? "bg-[#2EB8AA]" : "bg-slate-200"}`} />
          <div className={`absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${isChecked ? "translate-x-4" : "translate-x-0"}`} />
        </div>
      </label>
    )
  }

  if (field.type === "textarea") {
    return <TextArea label={field.label} value={typeof value === "string" ? value : ""} onChange={onChange} />
  }

  return (
    <TextField
      label={field.label}
      value={formatScalarValue(value, field.type)}
      onChange={(nextValue) => onChange(field.type === "number" ? Number(nextValue) : nextValue)}
      placeholder={field.placeholder}
      type={field.type === "number" ? "number" : "text"}
    />
  )
}

function formatScalarValue(value: unknown, type: FieldType) {
  if (type === "number") return typeof value === "number" ? String(value) : "0"
  return typeof value === "string" || typeof value === "number" ? String(value) : ""
}

function TextField({
  label,
  value,
  onChange,
  dir,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  dir?: "rtl"
  placeholder?: string
  type?: string
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6A727F]">
      {label}
      <input
        className={`h-11 w-full rounded-xl border border-[#E4E6EA]/80 bg-[#FAF9F6] px-4 text-sm font-normal normal-case text-[#101827] outline-none transition placeholder:text-slate-400 focus:border-[#2EB8AA] focus:ring-2 focus:ring-[#2EB8AA]/10 ${dir === "rtl" ? "text-right placeholder:text-right font-sans" : "text-left"
          }`}
        dir={dir}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  dir,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  dir?: "rtl"
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6A727F] md:col-span-1">
      {label}
      <textarea
        className={`min-h-[132px] w-full rounded-xl border border-[#E4E6EA]/80 bg-[#FAF9F6] p-4 text-sm font-normal normal-case text-[#101827] leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#2EB8AA] focus:ring-2 focus:ring-[#2EB8AA]/10 ${dir === "rtl" ? "text-right placeholder:text-right font-sans" : "text-left"
          }`}
        dir={dir}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
