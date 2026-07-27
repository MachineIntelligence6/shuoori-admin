import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

function requireEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name}`)
  }

  return value
}

function requireAnyEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]

    if (value) {
      return value
    }
  }

  throw new Error(`Missing ${names.join(" or ")}`)
}

function getR2Client() {
  const accountId = requireEnv("R2_ACCOUNT_ID")

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  })
}

function sanitizePathPart(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function buildSectionObjectKey(sectionKey: string, fileName: string) {
  const safeSectionKey = sanitizePathPart(sectionKey) || "general"
  const safeFileName = sanitizePathPart(fileName) || "upload"

  return `sections/${safeSectionKey}/${crypto.randomUUID()}-${safeFileName}`
}

export function buildPublicUrl(key: string) {
  return `${requireAnyEnv("R2_PUBLIC_URL", "R2_PUBLIC_BASE_URL").replace(/\/$/, "")}/${key}`
}

export async function uploadToR2({
  key,
  body,
  contentType,
}: {
  key: string
  body: Buffer
  contentType?: string
}) {
  const bucket = requireAnyEnv("R2_BUCKET_NAME", "R2_BUCKET")
  const client = getR2Client()

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType || "application/octet-stream",
    })
  )

  return {
    key,
    url: buildPublicUrl(key),
  }
}

export async function deleteFromR2(key: string) {
  const bucket = requireAnyEnv("R2_BUCKET_NAME", "R2_BUCKET")
  const client = getR2Client()

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )
}
