import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(
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

    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select(`
        *,
        persona:personas(*),
        messages(*)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const { data: messages, error: msgError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (msgError) throw msgError;

    let markdown = `# ${conversation.title}\n\n`;
    markdown += `**Date:** ${format(new Date(conversation.created_at), "PPP")}\n`;
    markdown += `**Persona:** ${conversation.system_prompt}\n\n`;
    markdown += `---\n\n`;

    messages?.forEach((msg) => {
      const role = msg.role === "user" ? "You" : "Assistant";
      markdown += `**${role}:** ${msg.content}\n\n`;
    });

    return new Response(markdown, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="${conversation.title.replace(
          /[^a-z0-9]/gi,
          "_"
        )}.md"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
