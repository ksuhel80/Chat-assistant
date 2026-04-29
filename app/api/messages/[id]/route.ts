import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("*, conversation:conversations(user_id)")
      .eq("id", id)
      .single();

    if (fetchError || !message || message.conversation.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    const { data: updatedMessage, error } = await supabase
      .from("messages")
      .update({ content })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
