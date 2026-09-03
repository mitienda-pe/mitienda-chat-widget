import { useChatStore, type Source, type ProductItem } from '../stores/chat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/** Un evento del stream del asistente. */
interface StreamEvent {
  type: 'progress' | 'text_delta' | 'text_reset' | 'products' | 'done' | 'error';
  label?: string;
  text?: string;
  reply?: string;
  products?: unknown[];
  message?: string;
}

function normalizarProductos(raw: unknown[] | undefined): ProductItem[] {
  if (!raw?.length) return [];
  return raw.map((p) => {
    const item = p as Record<string, any>;
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      product_url: item.product_url,
      permalink: item.permalink,
      brand: item.brand,
      category: item.category,
    };
  });
}

export function useChat() {
  const store = useChatStore();

  function buildBody(message: string) {
    const mode = store.widgetConfig.mode;
    const body: Record<string, any> = {
      message,
      session_id: store.sessionId,
      history: store.history.slice(0, -1),
    };

    if (store.widgetConfig.country) body.country = store.widgetConfig.country;
    if (mode === 'sales') body.mode = 'sales';
    if (mode === 'shopping' && store.widgetConfig.tiendaId) {
      body.tienda_id = store.widgetConfig.tiendaId;
    }

    return body;
  }

  /**
   * Modo compra, con la respuesta llegando por partes.
   *
   * Además del texto a medida que se escribe, el asistente cuenta qué está
   * haciendo ("Buscando polos…"): esa línea es lo que hace que una espera de
   * varios segundos no se sienta como una pantalla colgada.
   *
   * Devuelve false si el servidor no habla este protocolo, para poder caer al
   * endpoint de siempre sin que el comprador se entere.
   */
  async function streamShopping(message: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/shopping/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildBody(message)),
    });

    // Un backend anterior a este widget responde 404 acá: no es un error, es que
    // toca usar el camino clásico.
    if (!response.ok || !response.body) return false;

    const messageId = store.startAssistantMessage();
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let recibioAlgo = false;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Los eventos van separados por una línea en blanco, y un fragmento de red
        // puede cortar a la mitad de uno: lo que quede sin cerrar espera al
        // siguiente trozo.
        const bloques = buffer.split('\n\n');
        buffer = bloques.pop() ?? '';

        for (const bloque of bloques) {
          const linea = bloque.split('\n').find((l) => l.startsWith('data:'));
          if (!linea) continue;

          let evento: StreamEvent;
          try {
            evento = JSON.parse(linea.slice(5).trim());
          } catch {
            continue;
          }

          recibioAlgo = true;

          switch (evento.type) {
            case 'progress':
              store.progressLabel = evento.label ?? null;
              break;
            case 'text_delta':
              store.progressLabel = null;
              store.appendToMessage(messageId, evento.text ?? '');
              break;
            case 'text_reset':
              store.resetMessageContent(messageId);
              break;
            case 'products':
              store.setMessageProducts(messageId, normalizarProductos(evento.products));
              break;
            case 'done':
              store.setMessageProducts(messageId, normalizarProductos(evento.products));
              store.finishMessage(messageId, evento.reply);
              return true;
            case 'error':
              store.finishMessage(
                messageId,
                evento.message ?? 'No pude completar tu consulta. Intenta de nuevo.'
              );
              return true;
          }
        }
      }
    } finally {
      store.progressLabel = null;
    }

    // La conexión se cortó antes del cierre. Si ya había texto en pantalla se
    // conserva; si no llegó nada, el mensaje vacío se descarta y se reintenta por
    // el camino clásico.
    if (!recibioAlgo) {
      store.dropMessage(messageId);
      return false;
    }

    store.finishMessage(messageId);
    return true;
  }

  /** El camino de siempre: una sola respuesta, completa. */
  async function sendClassic(message: string) {
    const isShopping = store.widgetConfig.mode === 'shopping';
    const endpoint = isShopping ? '/shopping/chat' : '/chat';

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildBody(message)),
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const data = await response.json();

    const sources: Source[] = [];
    if (!isShopping && data.sources) {
      const seenUrls = new Set<string>();
      for (const s of data.sources) {
        if (s.url && !seenUrls.has(s.url)) {
          seenUrls.add(s.url);
          sources.push({ title: s.metadata?.title || s.metadata?.source || 'Artículo', url: s.url });
        }
      }
    }

    const products = isShopping ? normalizarProductos(data.products) : [];

    store.addMessage('assistant', data.reply, sources, products);
  }

  async function sendMessage(text: string) {
    const message = text.trim();
    if (!message || store.isLoading) return;

    store.addMessage('user', message);
    store.isLoading = true;

    try {
      const puedeStream =
        store.widgetConfig.mode === 'shopping' && typeof ReadableStream !== 'undefined';

      if (!puedeStream || !(await streamShopping(message))) {
        await sendClassic(message);
      }
    } catch (err) {
      console.error('Error enviando mensaje:', err);
      store.addMessage(
        'assistant',
        'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.'
      );
    } finally {
      store.isLoading = false;
      store.progressLabel = null;
    }
  }

  function sendSuggestion(text: string) {
    store.startConversation();
    sendMessage(text);
  }

  return { sendMessage, sendSuggestion };
}
