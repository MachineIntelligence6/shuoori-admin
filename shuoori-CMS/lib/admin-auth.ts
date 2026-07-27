export async function requireSignedInAdmin() {
  // TODO: Restore Clerk auth() check before launch.
  return { userId: "local-dev-admin" }
}
