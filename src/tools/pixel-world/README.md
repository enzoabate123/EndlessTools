# Pixel World Tool

## Funcionalidade
Cria uma estética de "8-bit moderno", misturando formas geométricas simples com materiais avançados como vidro (Glass/Transmission).

## Características da Interface (UI)
- **Sliders:**
  - `Pixel Size`: Controla a resolução do filtro de pixelização aplicado à vista ou às texturas.
  - `Glass Opacity`: Controla a transparência e índice de refração do material de vidro.

## Limitações
- Efeitos de transmissão (`MeshPhysicalMaterial.transmission`) no Three.js requerem passes de renderização adicionais nos bastidores, o que pode ser pesado ao empilhar múltiplos objetos de vidro.

## Requisitos Técnicos
- Uso extensivo de `MeshPhysicalMaterial` configurado para refração física.
- Uso possível de pós-processamento `Pixelation` do `@react-three/postprocessing`.

## Resultado Esperado
Cenários compostos por blocos tridimensionais que distorcem o que está atrás deles como prismas de vidro ou gelo, com uma estética visual de baixa resolução (pixelizada) no output final.
