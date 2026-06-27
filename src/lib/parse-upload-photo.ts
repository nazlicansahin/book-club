export async function parseUploadPhoto(
  request: Request
): Promise<{ buffer: Buffer; note?: string }> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { photoBase64?: string; note?: string };
    if (!body.photoBase64?.trim()) {
      throw new Error("Photo required");
    }
    return {
      buffer: Buffer.from(body.photoBase64, "base64"),
      note: body.note?.trim() || undefined,
    };
  }

  const formData = await request.formData();
  const photo = formData.get("photo");
  if (!photo || typeof photo === "string") {
    throw new Error("Photo required");
  }

  const arrayBuffer = await photo.arrayBuffer();
  const note = (formData.get("note") as string | null)?.trim() || undefined;
  return {
    buffer: Buffer.from(arrayBuffer),
    note,
  };
}
