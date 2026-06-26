# Cover Filters Tool (Post-Processing)

## Funcionalidade
Biblioteca de shaders de fragmento aplicáveis em tempo real à cena 3D renderedizada (Efeitos: Halftone, Glitch, Kaleidoscope, Liquify, Distortion, CRT/Retro).

## Características da Interface (UI)
- **Menu Empilhável (Stack):** UI que permite adicionar múltiplos filtros de pós-processamento, habilitando/desabilitando-os com *Toggles*.
- **Controlos Específicos por Efeito:**
  - *Halftone:* Tamanho do ponto, ângulo, blend mode.
  - *Glitch:* Intensidade do offset RGB, frequência.
  - *Depth of Field:* Foco (Focus distance), Aperture (Desfoque).
  - *Pixelate:* Resolução dos blocos de píxeis.

## Limitações
- Empilhar múltiplos efeitos caros (como Bloom + Depth of Field pesado) irá degradar rapidamente a performance (FPS) em GPUs integradas.
- Efeitos dependentes de profundidade requerem suporte correto ao `DepthBuffer` na renderização base.

## Requisitos Técnicos
- Arquitetura baseada em `@react-three/postprocessing` (EffectComposer).
- Escrita de Shaders Customizados (GLSL) envolvidos na API de Effects do R3F.

## Resultado Esperado
A estética visual final ("Vibe" / "Cover") da composição é radicalmente alterada de forma fotorealista ou artística, permitindo um "look and feel" semelhante aos projetos gerados no Endless Tools original.
