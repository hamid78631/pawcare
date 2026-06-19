import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { SitterProfileService } from '../sitter-profile/sitter-profile.service';
import { AnimalsService } from '../animals/animals.service';
import { BookingService } from '../booking/booking.service';
import { TOOLS } from './agent.tools';

interface CurrentUser {
  id: number;
  email: string;
  role: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_TOOL_ROUNDS = 5;

function sanitiseSitterProfile(profile: any) {
  if (!profile?.user) return profile;
  const { password, ...safeUser } = profile.user;
  return { ...profile, user: safeUser };
}

function buildSystemPrompt(user: CurrentUser | null): string {
  const base = `Tu es l'assistant PawCare, une plateforme qui connecte propriétaires d'animaux et pet-sitters.

Contexte sur la plateforme :
- Les propriétaires recherchent des sitters par ville et type d'animal accepté (chien, chat, autre).
- Les sitters ont un tarif par nuit ; le prix total d'une réservation = nombre de nuits × tarif.
- Une réservation passe par les statuts : en attente, confirmée, refusée/annulée, terminée.
- Réponds toujours en français, de façon concise et chaleureuse.
- N'invente jamais d'informations sur un sitter, un animal ou une réservation : utilise toujours les outils pour obtenir des données réelles avant de répondre.`;

  if (!user) {
    return `${base}\n\nL'utilisateur actuel n'est PAS connecté. Tu peux répondre aux questions générales et chercher des sitters, mais s'il veut réserver, explique-lui poliment qu'il doit d'abord se connecter (ou créer un compte propriétaire).`;
  }

  return `${base}\n\nUtilisateur actuel : connecté, rôle "${user.role}". ${
    user.role === 'owner'
      ? "C'est un propriétaire : tu peux utiliser list_my_animals et create_booking pour lui."
      : "C'est un pet-sitter : il ne peut pas réserver d'autres sitters, n'utilise pas create_booking pour lui."
  }`;
}

@Injectable()
export class AgentService {
  private client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY?.trim(),
    baseURL: 'https://api.groq.com/openai/v1',
  });
  private model = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

  constructor(
    private sitterProfileService: SitterProfileService,
    private animalsService: AnimalsService,
    private bookingService: BookingService,
  ) {}

  async chat(messages: ChatMessage[], user: CurrentUser | null): Promise<string> {
    // chez OpenAI, le prompt système est juste le premier message du tableau
    const conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: buildSystemPrompt(user) },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await this.callModel(conversation);
      if (!response) {
        return "Désolé, je n'ai pas réussi à traiter votre demande. Pouvez-vous reformuler votre question ?";
      }

      const message = response.choices[0].message;
      const toolCalls = message.tool_calls ?? [];

      if (toolCalls.length === 0) {
        return message.content ?? "Désolé, je n'ai pas de réponse.";
      }

      // 1. on ajoute la réponse du modèle (qui contient les demandes de tool_calls) à la conversation
      conversation.push(message);

      // 2. on exécute chaque tool demandé, et on ajoute UN message "tool" par appel
      for (const toolCall of toolCalls) {
        if (toolCall.type !== 'function') continue;
        const input = JSON.parse(toolCall.function.arguments);
        const result = await this.executeTool(toolCall.function.name, input, user);
        conversation.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    return "Désolé, je n'ai pas réussi à traiter votre demande.";
  }

  // Le modèle échoue parfois à formater un appel d'outil correctement
  // (surtout sur les modèles open-source) — on retente une fois avant d'abandonner.
  private async callModel(
    conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  ): Promise<OpenAI.Chat.Completions.ChatCompletion | null> {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await this.client.chat.completions.create({
          model: this.model,
          messages: conversation,
          tools: TOOLS,
        });
      } catch {
        if (attempt === 1) return null;
      }
    }
    return null;
  }

  async executeTool(name: string, input: any, user: CurrentUser | null): Promise<any> {
    switch (name) {
      case 'search_sitters': {
        const results = await this.sitterProfileService.search(input.city, input.animal_type);
        return { results: results.map(sanitiseSitterProfile) };
      }
      case 'get_sitter_details': {
        const profile = await this.sitterProfileService.findOne(input.sitter_id);
        return { profile: sanitiseSitterProfile(profile) };
      }
      case 'list_my_animals': {
        if (!user) return { error: 'Vous devez être connecté pour voir vos animaux.' };
        const animals = await this.animalsService.findAllByOwner(user.id);
        return { animals };
      }
      case 'create_booking': {
        if (!user) return { error: 'Vous devez être connecté pour réserver.' };
        if (user.role !== 'owner') return { error: 'Seuls les propriétaires peuvent réserver un sitter.' };
        const booking = await this.bookingService.create(
          {
            sitterId: input.sitter_user_id,
            animalId: input.animal_id,
            startDate: input.start_date,
            endDate: input.end_date,
            message: input.message,
          },
          user.id,
        );
        return { booking };
      }
      default:
        return { error: `Outil inconnu: ${name}` };
    }
  }
}
