# Shape Extrude Tool (3D Extrude)

## Funcionalidade
Um motor que aceita o carregamento de ficheiros vetoriais (SVG) e que os converte em geometria sólida 3D. 

## Características da Interface (UI)
- **Botão de Upload:** Para carregar arquivos `.svg`.
- **Sliders (Deslizadores):**
  - `Extrude Depth`: Controla a profundidade/espessura da forma 3D.
  - `Bevel Size`: Controla a suavização/chanfro das arestas.
  - `Bevel Segments`: Define a resolução do chanfro.
- **Color Picker:** Seleção de cor do material.

## Limitações
- Apenas suporta caminhos SVG simples (paths fechados). SVGs muito complexos com milhares de pontos podem causar perda de framerate (lag) devido à triangulação via Three.js (SVGLoader).
- Gradientes SVG não são traduzidos diretamente para texturas 3D na versão inicial.

## Requisitos Técnicos
- Utilizar o `SVGLoader` do Three.js (`three/examples/jsm/loaders/SVGLoader`).
- Extrusão feita usando `ExtrudeGeometry`.

## Resultado Esperado
Um logo ou forma 2D plana transforma-se instantaneamente num objeto 3D robusto, reativo à iluminação (HDRI) da cena, pronto para receber materiais PBR.
