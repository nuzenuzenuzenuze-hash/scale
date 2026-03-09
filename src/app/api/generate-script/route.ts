import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getBrandContextFileContent } from "@/lib/actions/brands";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY no configurada" },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      brand_id,
      framework_type,
      funnel_position,
      platform,
      idea_description,
      additional_prompt,
    } = body;

    // Get brand data
    const { data: brand } = await supabase
      .from("brands")
      .select("*")
      .eq("id", brand_id)
      .eq("user_id", user.id)
      .single();

    if (!brand) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 });
    }

    // Get brand context file content
    let brandContextContent = "";
    if (brand.brand_context_file) {
      brandContextContent = await getBrandContextFileContent(brand.brand_context_file);
    }

    // Get recent trend signals
    const { data: trends } = await supabase
      .from("trend_signals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const trendContext = trends?.length
      ? trends.map((t) => `- Hook: "${t.hook_used}" | Formato: ${t.format} | Tipo: ${t.type}`).join("\n")
      : "No hay señales de tendencia recientes.";

    // Build the system prompt
    const frameworkInstructions = framework_type === "documented"
      ? `FRAMEWORK: DOCUMENTADO
Este es un contenido de estilo "documentado" — el creador comparte su experiencia, proceso o aprendizaje real.
El tono debe ser auténtico, como si estuviera hablando con un amigo cercano.
Usa primera persona. Muestra vulnerabilidad cuando sea apropiado.
La estructura sigue: Gancho → Contexto personal → Lección/Insight → CTA.`
      : `FRAMEWORK: ENGINEERED
Este es un contenido "engineered" — diseñado estratégicamente para maximizar engagement.
Usa patrones probados: listas, contrarios, revelaciones, loops abiertos.
El tono puede ser más directo y provocador.
La estructura sigue: Hook fuerte → Desarrollo con tensión → Payoff → CTA.`;

    const funnelInstructions = {
      tofu: `POSICIÓN EN EMBUDO: TOFU (Top of Funnel) — DESCUBRIMIENTO
Objetivo: Alcance máximo. Atraer nuevas audiencias.
El contenido debe ser accesible, entretenido, y con alto potencial de compartir.
Evita jerga técnica. Prioriza lo visual y emocional.
El CTA debe ser suave: seguir, guardar, o comentar.`,
      mofu: `POSICIÓN EN EMBUDO: MOFU (Middle of Funnel) — CONSIDERACIÓN
Objetivo: Generar confianza y autoridad.
El contenido debe demostrar expertise y dar valor real.
Puedes usar terminología del nicho. Muestra resultados y procesos.
El CTA puede ser: guardar para después, compartir con alguien que lo necesite, visitar link.`,
      bofu: `POSICIÓN EN EMBUDO: BOFU (Bottom of Funnel) — CONVERSIÓN
Objetivo: Convertir seguidores en clientes/comunidad.
El contenido debe crear urgencia o FOMO de manera auténtica.
Comparte testimonios, casos de éxito, ofertas.
El CTA debe ser directo: link en bio, DM para más info, apuntarse.`,
    };

    const platformInstructions: Record<string, string> = {
      instagram_reels: "PLATAFORMA: Instagram Reels — Máximo 90 segundos. Visual first. Texto en pantalla complementa la voz. Hooks en los primeros 1.5 segundos.",
      tiktok: "PLATAFORMA: TikTok — Formato nativo, casual. Trends friendly. Hooks agresivos. Puede ser más largo pero mantén la tensión.",
      youtube_shorts: "PLATAFORMA: YouTube Shorts — Máximo 60 segundos. Más informativo. Hooks claros. Puede ser más 'polished'.",
      linkedin: "PLATAFORMA: LinkedIn — Formato texto largo. Profesional pero humano. Storytelling business. Hook en primera línea.",
      twitter: "PLATAFORMA: Twitter/X — Conciso. Thread-friendly. Opiniones fuertes. Datos concretos. Formato escaneable.",
    };

    const systemPrompt = `Eres un estratega de contenido experto en creación de scripts para redes sociales.
Tu trabajo es generar scripts que sigan frameworks probados y estén adaptados al contexto de la marca.

MARCA: ${brand.name}
NICHO: ${brand.niche}
TONO: ${brand.tone}
AUDIENCIA OBJETIVO: ${brand.target_audience}

${brandContextContent ? `CONTEXTO DE MARCA (del archivo de la marca):\n${brandContextContent}\n` : ""}

${frameworkInstructions}

${funnelInstructions[funnel_position as keyof typeof funnelInstructions] || ""}

${platform ? platformInstructions[platform] || "" : ""}

TENDENCIAS RECIENTES DETECTADAS:
${trendContext}

REGLAS:
1. El hook debe ser MUY fuerte — el 80% del éxito está aquí
2. El cuerpo debe mantener la atención con loops, revelaciones o valor real
3. El CTA debe ser natural, no forzado
4. Adapta el lenguaje al tono de la marca
5. El script debe sentirse como si lo escribiera el creador, no una IA
6. Mantén el formato adecuado para la plataforma seleccionada

FORMATO DE RESPUESTA (responde SOLO con este JSON, sin markdown):
{"hook": "texto del hook", "body": "texto del cuerpo", "cta": "texto del CTA"}`;

    const userMessage = idea_description
      ? `Genera un script para esta idea: ${idea_description}${additional_prompt ? `\n\nInstrucciones adicionales: ${additional_prompt}` : ""}`
      : `Genera un script de contenido para la marca ${brand.name}.${additional_prompt ? `\n\nInstrucciones adicionales: ${additional_prompt}` : ""}`;

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    // Parse the response
    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: { hook: string; body: string; cta: string };
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      // If parsing fails, try to split the response into sections
      parsed = {
        hook: responseText.split("\n")[0] || responseText,
        body: responseText,
        cta: "",
      };
    }

    // Auto-save hook to hooks library
    if (parsed.hook) {
      await supabase.from("hooks_library").insert({
        hook_text: parsed.hook,
        type: framework_type || "documented",
        source: "ai_generated",
        niche: brand.niche,
        platform: platform || "instagram_reels",
        performance_score: 0,
        times_used: 1,
        user_id: user.id,
      }).then(() => {
        // Silently save, don't block on errors
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating script:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al generar el script" },
      { status: 500 }
    );
  }
}
