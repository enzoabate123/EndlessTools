# Dream Chrome Tool

## Funcionalidade
Uma ferramenta focada na criação de materiais hiper-reflexivos e etéreos, misturando superfícies metálicas perfeitas (Chrome) com auras brilhantes (Glow/Bloom) e uma estética gótica/onírica.

## Características da Interface (UI)
- **Color Picker:**
  - `Glow Color`: A cor da emissão de luz interna ou aura do objeto.
- **Sliders:**
  - `Chrome Intensity`: O nível de reflexão do ambiente no material.

## Limitações
- Para atingir o "Glow" (brilho) característico, é obrigatório um passe de pós-processamento de Bloom (`EffectComposer`), que afeta o rendimento geral da cena.

## Requisitos Técnicos
- Configuração de material com `metalness` a 1 e `roughness` a 0.
- Interação com `Environment` maps específicos com alto contraste para destacar as reflexões.

## Resultado Esperado
Malhas intrincadas (ex: nós toroidais ou tipografia gótica) renderizadas com aspeto de cromo líquido a brilhar neon em zonas de oclusão.
