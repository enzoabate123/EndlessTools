# Lego Landscape Tool

## Funcionalidade
Converte malhas 3D suaves ou mapas de altura num cenário voxelizado, comissionando blocos de estilo Lego para formar a estrutura.

## Características da Interface (UI)
- **Sliders:**
  - `Block Size`: Determina a resolução/tamanho de cada voxel (bloco).
  - `Height`: Controla a escala vertical (extrusão) da paisagem.

## Limitações
- Algoritmos de voxelização podem ser muito pesados computacionalmente no lado do cliente (browser) se a resolução (`Block Size`) for muito pequena ou a malha muito densa.

## Requisitos Técnicos
- O algoritmo necessita de raycasting contra uma grelha espacial, ou a geração de geometria através de instanciamento de blocos (`InstancedMesh`) em posições arredondadas para os múltiplos do `Block Size`.

## Resultado Esperado
Uma superfície topográfica ou objeto convertido em "tijolos", lembrando gráficos de 8-bits transpostos para a terceira dimensão com iluminação realista.
