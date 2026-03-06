# MiTienda Chat Widget

Widget de chat embebible para MiTienda. Soporta dos modos: **Soporte** (RAG sobre knowledge base) y **Shopping Assistant** (busqueda de productos con IA).

## Uso via jsDelivr

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mitienda-pe/mitienda-chat-widget@main/dist/mitienda-chat.css" />

<!-- JS -->
<script src="https://cdn.jsdelivr.net/gh/mitienda-pe/mitienda-chat-widget@main/dist/mitienda-chat.iife.js"></script>
```

### Modo Soporte (landing page)

```html
<script src="https://cdn.jsdelivr.net/gh/mitienda-pe/mitienda-chat-widget@1/dist/mitienda-chat.iife.js"
  data-mode="support">
</script>
```

### Modo Shopping (tiendas)

```html
<script src="https://cdn.jsdelivr.net/gh/mitienda-pe/mitienda-chat-widget@1/dist/mitienda-chat.iife.js"
  data-mode="shopping"
  data-tienda-id="123">
</script>
```

### Atributos

| Atributo | Requerido | Default | Descripcion |
|----------|-----------|---------|-------------|
| `data-mode` | No | `support` | `support` o `shopping` |
| `data-tienda-id` | Shopping | - | ID de la tienda (modo shopping) |
| `data-bot-name` | No | Auto | Nombre del bot en el header |

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Genera `dist/mitienda-chat.iife.js` y `dist/mitienda-chat.css`.

## Versionado

Para publicar una nueva version via jsDelivr:

```bash
npm run build
git add dist/
git commit -m "release: v1.x.x"
git tag v1.x.x
git push origin main --tags
```

jsDelivr sirve automaticamente por tag: `@v1.0.0`, por major: `@1`, o por branch: `@main`.

## Variables de entorno (desarrollo)

Crear `.env` en la raiz:

```
VITE_API_URL=http://localhost:3001
VITE_BOT_NAME=Soporte MiTienda
VITE_SHOPPING_BOT_NAME=Asistente de Compras
VITE_WHATSAPP_NUMBER=51967797232
```
