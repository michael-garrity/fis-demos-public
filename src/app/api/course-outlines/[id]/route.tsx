export { GET } from "./get"
export { PUT } from "./put"
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(id, { status: 200 });
}
