# Import Pipeline Tool

## Funcionalidade
Um sistema drag-and-drop fluido para carregar malhas nos formatos universais (FBX, OBJ, GLTF, GLB).

## Características da Interface (UI)
- **Dropzone Central:** Um overlay que aparece quando um ficheiro é arrastado sobre a janela do browser.
- **File Input:** Botão manual de seleção de ficheiro.
- **Painel de Malha:** Lista os nós (nodes) e materiais (materials) associados ao objeto importado, permitindo substituir os materiais originais pelo sistema PBR interno.

## Limitações
- Ficheiros muito grandes (ex: > 50MB) ou com texturas de 8K embutidas podem travar o navegador ou exceder a memória da GPU em máquinas mais fracas.
- Animações complexas (Skeletal Animation/Rigging) de ficheiros FBX podem não ser suportadas de imediato na V1.

## Requisitos Técnicos
- Instanciação de loaders dinâmicos baseados na extensão do ficheiro (`GLTFLoader`, `OBJLoader`, `FBXLoader` do Three.js).
- Parse dos materiais para os mapear num `MeshStandardMaterial` ou `MeshPhysicalMaterial` customizável.

## Resultado Esperado
O objeto externo é integrado no centro da cena 3D, redimensionado (auto-scale) para caber no viewport, pronto para direção de arte.
