# Liquid Metal Tool

## Funcionalidade
Um efeito interativo e abstrato que simula uma superfície metálica fluida e distorcida, inspirada no estilo "Chrome" e "Liquid".

## Características da Interface (UI)
- **Sliders:**
  - `Roughness`: Define o quão polida ou baça é a superfície.
  - `Metalness`: Define o aspeto metálico do material.
  - `Speed`: Controla a velocidade da distorção ou rotação fluida.
- **Color Picker:**
  - `Color`: A cor base do metal (geralmente cinza/prata, mas ajustável).

## Limitações
- Na versão V1, a distorção é feita apenas por rotação básica. Idealmente, requer shaders de vértice personalizados (GLSL) com ruído Simplex (Simplex Noise) para deformar a malha em tempo real.

## Requisitos Técnicos
- Utilização pesada de HDRI (Environment map) para reflexos realistas.
- `MeshStandardMaterial` para PBR básico, ou custom shader para distorção orgânica real.

## Resultado Esperado
Um objeto (esfera, gota) com aspeto de mercúrio ou metal derretido que reflete intensamente o ambiente e se deforma ou move continuamente.
