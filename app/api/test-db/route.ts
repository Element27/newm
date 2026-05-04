import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    
    if (!supabase) {
      return NextResponse.json({ 
        error: "Supabase not configured",
        envStatus: {
          url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      }, { status: 500 });
    }

    // Test database connection
    const { data, error } = await supabase.from("items").select("*").limit(1);
    
    if (error) {
      return NextResponse.json({ 
        error: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Database connection successful",
      itemsCount: data?.length || 0,
      sampleData: data?.[0] || null
    });

  } catch (error) {
    return NextResponse.json({ 
      error: "Server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}