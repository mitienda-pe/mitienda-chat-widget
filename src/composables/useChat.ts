import { useChatStore, type Source, type ProductItem } from '../stores/chat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useChat() {
  const store = useChatStore();

  async function sendMessage(text: string) {
    const message = text.trim();
    if (!message || store.isLoading) return;

    store.addMessage('user', message);
    store.isLoading = true;

    try {
      const mode = store.widgetConfig.mode;
      const isShopping = mode === 'shopping';
      const endpoint = isShopping ? '/shopping/chat' : '/chat';

      const body: Record<string, any> = {
        message,
        session_id: store.sessionId,
        history: store.history.slice(0, -1),
      };

      if (store.widgetConfig.country) {
        body.country = store.widgetConfig.country;
      }

      if (mode === 'sales') {
        body.mode = 'sales';
      }

      if (isShopping && store.widgetConfig.tiendaId) {
        body.tienda_id = store.widgetConfig.tiendaId;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();

      // Support/Sales mode: extract sources
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

      // Shopping mode: extract products
      const products: ProductItem[] = [];
      if (isShopping && data.products) {
        for (const p of data.products) {
          products.push({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            product_url: p.product_url,
            permalink: p.permalink,
            brand: p.brand,
            category: p.category,
          });
        }
      }

      store.addMessage('assistant', data.reply, sources, products);
    } catch (err) {
      console.error('Error enviando mensaje:', err);
      store.addMessage(
        'assistant',
        'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.'
      );
    } finally {
      store.isLoading = false;
    }
  }

  function sendSuggestion(text: string) {
    store.startConversation();
    sendMessage(text);
  }

  return { sendMessage, sendSuggestion };
}
