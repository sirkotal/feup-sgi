# SGI 2024/2025 - TP1

## Group T05G07

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| João Pedro Rodrigues Coutinho         | 202108787 | up202108787@up.pt                |
| Miguel Jorge Medeiros Garrido         | 202108889 | up202108889@up.pt                |

----
## Associated Exercises (links to README files)

- [Geometric Transformations](https://gitlab.up.pt/meic-sgi/sgi-2024-2025/t05/sgi-t05-g07/-/blob/geometric-transformations-exercise/tp1/README.md)
- [Illumination](https://gitlab.up.pt/meic-sgi/sgi-2024-2025/t05/sgi-t05-g07/-/blob/illumination-exercise/tp1/README.md)
- [Textures](https://gitlab.up.pt/meic-sgi/sgi-2024-2025/t05/sgi-t05-g07/-/blob/illumination-exercise/tp1/README.md)
- [Curved Lines](https://gitlab.up.pt/meic-sgi/sgi-2024-2025/t05/sgi-t05-g07/-/blob/curves-exercise/tp1/README.md)
- [Curved Surfaces](https://gitlab.up.pt/meic-sgi/sgi-2024-2025/t05/sgi-t05-g07/-/blob/curved-surfaces-exercise/tp1/README.md)
- [Shadows](https://gitlab.up.pt/meic-sgi/sgi-2024-2025/t05/sgi-t05-g07/-/blob/shadow-exercise/tp1/README.md)
----
## Project Information

- One of the main strengths of our project is the use of several types of primitives, materials and textures, as well as the use of audio to make the scene feel more immersive.

- The scene, which possesses a set of different cameras, controllable on the graphical interface, contains the following objects:
  - Floor
  - Walls
  - Table
  - Plate
  - Cake without a slice
  - Candle with a flame
  - Spotlight
  - Two paintings with portraits
  - VW Beetle on a whiteboard
  - Coil Spring
  - Newspaper
  - Jar
  - Flower
  - Window/Landscape
  - Chair
  - Knife
  - Phonograph
  - Pens
  - Piece of Furniture
  - Carpet

- In addition to these objects, we also included some additional effects:
  - There are several randomized crumbs in the plate, due to the missing cake slice
  - Not only does the landscape have a panorama effect, but the window also simulates the effect of broken glass
  - There are multiple petals on the table, simulating a dead flower
  - The phonograph itself can be turned on and off, using the GUI, allowing it to play some music; there is a visual effect that indicates whether it is on or off
  - The chair has a broken leg, which is why it's lying on the floor

<div align="center">

![Scene](utils/scene_print.png)
</div>

----
## Issues/Problems

- NURBS surfaces require a high sample count to have smoother curves, which may affect the overall performance of the scene. Therefore, the objects that make use of them (like the coil spring, for example) may not have a perfect geometry.
- The newspaper may have some clipping while interacting with the table due to its geometry.
- There were some issues with implementing the GUI controls caused by the need of updating values inside certain objects.