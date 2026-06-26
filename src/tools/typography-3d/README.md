# Typography 3D Tool

## Funcionalidade
Um conversor nativo que transforma texto editável em geometria 3D estática ou animável.

## Características da Interface (UI)
- **Text Input:** Campo de texto livre para inserção da tipografia.
- **Dropdown de Fontes:** Seleção de fontes pré-carregadas (Serif, Sans-Serif, Wide-angle).
- **Sliders:**
  - `Size`: Escala do texto.
  - `Thickness`: Profundidade da extrusão.
  - `Curve Segments`: Resolução das curvas das letras.
  - `Letter Spacing` (Tracking): Distância entre os caracteres.
- **Toggles:**
  - `Animate Individual Letters`: Ativa animações sequenciais de entrada/saída.

## Limitações
- Fontes necessitam de ser convertidas para o formato JSON (`facetype.js`) para serem compatíveis nativamente com `TextGeometry` do Three.js, limitando o uso de fontes `.ttf`/`.woff` locais diretamente.
- Textos excessivamente longos (parágrafos) podem impactar o desempenho da renderização de sombras.

## Requisitos Técnicos
- Utilizar `TextGeometry` ou o componente `<Text3D>` do pacote `@react-three/drei`.
- Carregamento de fontes em formato JSON.

## Resultado Esperado
Texto renderizado no espaço 3D de forma volumétrica, respondendo fisicamente à iluminação e materiais aplicados.
